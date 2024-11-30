import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { getVideos, getVideosBySubscriptions } from "../redux/actions/video";
import { connect } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";

function VideoGrid({ videos_list, getVideos, getVideosBySubscriptions }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const location = useLocation();
  const { id } = params;
  const isOnSubscriptionsPage = location.pathname === '/subscriptions';

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        if (isOnSubscriptionsPage) {
          await getVideosBySubscriptions();
        } else {
          await getVideos(id || null);
        }
        setError(null);
      } catch (err) {
        console.error("Error al cargar los videos:", err);
        setError("Error al cargar los videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos(); // Ejecutar la función de carga
  }, [getVideos, id, isOnSubscriptionsPage]);

  useEffect(() => {
    if (videos_list && Array.isArray(videos_list.videos)) {
      setVideos(videos_list.videos); // Actualizar el estado solo si es un arreglo válido
    }
  }, [videos_list.videos]);

  return (
    <Layout>
      {loading ? (
        <div className="text-white text-center p-4">Cargando videos...</div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : videos.length === 0 ? (
        <div className="text-white text-center p-4">No hay videos disponibles</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 bg-gray-900">
          {videos.map((video) => (
            <Link to={`/watch/${video._id}`}>
              <div
                key={video.id}
                className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:cursor-pointer"
              >
                <img
                  src={video.urlMiniature}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg truncate hover:text-purple-400">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">{video.channel}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {video.views?.toLocaleString()} vistas
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  videos_list: state.video.videos,
});

export default connect(mapStateToProps, { getVideos,getVideosBySubscriptions })(VideoGrid);
