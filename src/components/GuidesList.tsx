import { useUserGuides, UserGuide } from '@/hooks/useUserGuides';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

export const GuidesList = () => {
  const { guides, loading, error } = useUserGuides();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={24} />
            Mis Guías
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-600">Cargando guías...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={24} />
            Mis Guías
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (guides.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={24} />
            Mis Guías
          </CardTitle>
          <CardDescription>Guías que has comprado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-600">
            <p>No tienes guías compradas aún.</p>
            <p className="text-sm text-gray-500 mt-2">
              Cuando compres guías, aparecerán aquí para que puedas acceder a ellas.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen size={24} />
          Mis Guías
        </CardTitle>
        <CardDescription>Guías disponibles ({guides.length})</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide: UserGuide) => (
            <div
              key={guide.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              {guide.image_url && (
                <img
                  src={guide.image_url}
                  alt={guide.title}
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{guide.title}</h3>
              {guide.category && (
                <Badge className="mb-3">{guide.category}</Badge>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {guide.description || 'Sin descripción'}
              </p>
              <p className="text-xs text-gray-500">
                Publicado: {new Date(guide.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
