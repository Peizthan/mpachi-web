import { useAllProfiles } from '@/hooks/useAllProfiles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users } from 'lucide-react';

export const AllUsersList = () => {
  const { profiles, loading, error, updatingRoleId, updateUserRole } = useAllProfiles();

  const handleRoleToggle = async (userId: string, currentRole: 'user' | 'admin') => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    await updateUserRole(userId, nextRole);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={24} />
            Todos los Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-600">Cargando usuarios...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={24} />
            Todos los Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (profiles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={24} />
            Todos los Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-600">No hay usuarios registrados.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={24} />
          Todos los Usuarios
        </CardTitle>
        <CardDescription>Total: {profiles.length} usuarios</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Registrado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.email}</TableCell>
                  <TableCell>{profile.full_name || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                      {profile.role === 'admin' ? '🔐 Admin' : 'Usuario'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(profile.created_at).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={profile.role === 'admin' ? 'outline' : 'default'}
                      disabled={updatingRoleId === profile.id}
                      onClick={() => handleRoleToggle(profile.id, profile.role)}
                    >
                      {updatingRoleId === profile.id
                        ? 'Guardando...'
                        : profile.role === 'admin'
                          ? 'Quitar admin'
                          : 'Hacer admin'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
