import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, User } from "lucide-react";
import Layout from "../layout/Layout";
import { useParams, useNavigate, Link } from "react-router-dom";
import { connect } from "react-redux";
import { getVideos, getVideoById, likeVideo, suscribe, addCommentToVideo } from "../redux/actions/video";
import { formatDistanceToNow } from "date-fns"; // Asegúrate de instalar date-fns para manejar fechas fácilmente
import { es } from "date-fns/locale";

function VideoPage({ getVideos, getVideoById, video_in, videos_list, session, likeVideo, suscribers, suscribe, suscribed, ownVideo, addCommentToVideo }) {
  const [ownVideoState, setOwnVideoState] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [video, setVideo] = useState({});
  const [videos, setVideos] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(suscribe);
  const [countSuscribers, setCountSuscribers] = useState(0);
  const [comment, setComment] = useState("");
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const formatViews = (views) => {
    if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M vistas`;
    if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K vistas`;
    return `${views}`;
  };
  console.log(session)
  useEffect(() => {
    console.log(session);
    const checkSession = () => {
      if (session === null) {
        setSessionLoading(true);
      } else {
        setSessionLoading(false);
      }
    };

    checkSession();
  }, [session]);

  const timeAgo = video.createdAt
    ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true, locale: es })
    : "";

  // Obtener el video por ID
  useEffect(() => {
    if (!sessionLoading) {
      const fetchVideoById = async () => {
        try {
          setLoadingVideo(true);
          await getVideoById(id, session);
          setError(null);
        } catch (err) {
          console.error("Error al cargar el video:", err);
          setError("Error al cargar el video.");
        } finally {
          setLoadingVideo(false);
        }
      };
      fetchVideoById();
    }
  }, [id, getVideoById, session, sessionLoading]);

  // Obtener los videos recomendados
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoadingVideos(true);
        await getVideos();
      } catch (err) {
        console.error("Error al cargar los videos recomendados:", err);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchVideos();
  }, [getVideos]);

  useEffect(() => {
    if (videos_list && Array.isArray(videos_list.videos)) {
      setVideos(videos_list.videos);
    }
  }, [videos_list.videos]);

  useEffect(() => {
    setVideo(video_in);
  }, [video_in]);

  useEffect(() => {
    setCountSuscribers(suscribers);
  }, [suscribers]);

  useEffect(() => {
    setIsSubscribed(suscribed);
  }, [suscribed]);

  useEffect(() => {
    if (ownVideo) {
      setOwnVideoState(ownVideo);
    }
  }, [ownVideo]);

  const handleSubscribe = (video) => {
    if (!session) {
      setShowModal(true);
    } else {
      suscribe(video._id);
    }
  };

  const handleLike = (video, like) => {
    if (!session) {
      setShowModal(true);
    } else {
      likeVideo(video._id, like);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!session) {
      setShowModal(true);
    } else {
      addCommentToVideo(video._id, comment);
      setComment("");
    }
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row">
        <main className="flex-1 overflow-y-auto p-4 lg:w-3/4">
          {loadingVideo ? (
            <p className="text-center text-white">Cargando video...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : video ? (
            <>
              <div className="max-w-4xl mx-auto">
                <div
                  className="relative mb-4 w-full h-0"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <iframe
                    src={video.url}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
                <h1 className="text-2xl font-semibold text-white-800 mb-2">{video.title}</h1>

                {/* Bloque de vistas y fecha */}
                <div className="flex items-center space-x-4 text-sm mb-1">
                  <div className="flex items-center space-x-1">
                    {/* Vistas */}
                    <p className="font-medium text-blue-600">{formatViews(video.views || 0)} vistas</p>
                    <span className="text-gray-400">•</span>
                    {/* Fecha */}
                    <p className="text-gray-300">{timeAgo}</p>
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-sm text-gray-600 mb-6">{video.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                      {video.channelImage ? (
                        <img
                          src={video.channelImage}
                          alt="Avatar"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <User className="w-full h-full text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{video.channel}</p>
                      <p className="text-sm text-gray-500">
                        {countSuscribers ? countSuscribers : 0} suscriptores
                      </p>
                    </div>

                    {ownVideoState ? '' : (
                      <button
                        onClick={() => handleSubscribe(video)}
                        className={`px-4 py-2 rounded-md ${isSubscribed
                          ? "border border-gray-300 bg-white text-gray-700"
                          : "bg-blue-500 text-white"
                          }`}
                      >
                        {isSubscribed ? "Suscrito" : "Suscribirse"}
                      </button>
                    )

                    }

                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLike(video, true)}
                      className="px-4 py-2 border border-gray-300 rounded-md flex items-center"
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" /> {video.likes || 0}
                    </button>
                    <button
                      onClick={() => handleLike(video, false)}
                      className="px-4 py-2 border border-gray-300 rounded-md flex items-center">
                      <ThumbsDown className="mr-2 h-4 w-4" /> {video.dislikes || 0}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sección de Comentarios */}
              <div className="max-w-4xl mx-auto mt-8">
                <h2 className="text-xl font-semibold mb-4">Comentarios</h2>
                {session ? (
                  <form onSubmit={handleCommentSubmit} className="mb-4">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Escribe tu comentario..."
                      className="w-full p-2 border border-gray-300 rounded-md text-black"
                      rows="4"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-md"
                    >
                      Enviar Comentario
                    </button>
                  </form>
                ) : (
                  <p className="text-center text-red-500">
                    Debes iniciar sesión para comentar.
                  </p>
                )}

                {video.comments && video.comments.length > 0 ? (
                  video.comments.map((comment) => (
                    <div
                      key={comment.timestamp}
                      className="border-b border-gray-300 py-4"
                    >
                      <div className="flex items-center space-x-4">
                        <User className="w-10 h-10 text-gray-400" />
                        <div>
                          <p className="font-semibold">{comment.name_user}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(comment.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2">{comment.commentText}</p>
                    </div>
                  ))
                ) : (
                  <p>No hay comentarios aún.</p>
                )}
              </div>
            </>


          ) : (
            <p className="text-center text-white">No se encontró el video.</p>
          )}

        </main>

        {/* Sidebar con videos relacionados */}
        <aside className="lg:w-1/4 p-4 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Videos relacionados</h2>
          {loadingVideos ? (
            <p>Cargando videos relacionados...</p>
          ) : Array.isArray(videos) && videos.length > 0 ? (
            videos.map((relatedVideo) => (
              <div key={relatedVideo.id} className="flex space-x-2">
                <Link to={`/watch/${relatedVideo._id}`}>
                  <img
                    src={relatedVideo.urlMiniature}
                    alt={relatedVideo.title}
                    className="w-40 h-24 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{relatedVideo.title}</h3>
                    <p className="text-sm text-gray-500">{relatedVideo.channel}</p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No se encontraron videos relacionados.</p>
          )}
        </aside>
      </div>

      {/* Modal de inicio de sesión */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-md w-80 text-center">
            <p className="mb-4 text-black">
              ¡Debes iniciar sesión para realizar esta acción!
            </p>
            <button
              onClick={redirectToLogin}
              className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
            >
              Iniciar sesión
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  video_in: state.video.video,
  videos_list: state.video.videos || [],
  suscribers: state.video.suscribers || 0,
  suscribed: state.video.suscribed,
  ownVideo: state.video.ownVideo,
  session: state.auth.session,
});

export default connect(mapStateToProps,
  {
    getVideos,
    getVideoById,
    likeVideo,
    suscribe,
    addCommentToVideo
  })(VideoPage);
