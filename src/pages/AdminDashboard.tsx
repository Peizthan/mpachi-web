import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { LogOut, BarChart3, Users, ShoppingCart, BookOpen, TrendingUp, Settings, Shield, AlertTriangle, Rocket, FileText, Tag, CreditCard } from 'lucide-react';
import { AllUsersList } from '@/components/AllUsersList';
import { AllOrdersList } from '@/components/AllOrdersList';
import { AccessLogsList } from '@/components/AccessLogsList';
import { AdminGuidesManager } from '@/components/AdminGuidesManager';
import { AdminSalesReport } from '@/components/AdminSalesReport';
import { AdminSiteSettings } from '@/components/AdminSiteSettings';
import { AdminPaymentReconciliation } from '@/components/AdminPaymentReconciliation';
import { AdminGoLiveChecklist } from '@/components/AdminGoLiveChecklist';
import { AdminPageContent } from '@/components/AdminPageContent';
import { AdminDiscountCodes } from '@/components/AdminDiscountCodes';
import { AdminMonetization } from '@/components/AdminMonetization';
import Navigation from '@/components/Navigation';

const AdminDashboard = () => {
  const { signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-32 pb-16 px-4">
      <Navigation />
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <BarChart3 size={40} />
              Panel Administrativo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestión completa de usuarios, pedidos, tienda y configuración
            </p>
          </div>
          <Button onClick={handleSignOut} variant="destructive" className="flex items-center gap-2">
            <LogOut size={18} />
            Cerrar Sesión
          </Button>
        </div>

        {/* Tabbed sections */}
        <Tabs defaultValue="store" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="store" className="flex items-center gap-2">
              <BookOpen size={16} />
              Tienda / Catálogo
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart size={16} />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <TrendingUp size={16} />
              Ventas
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Shield size={16} />
              Registros
            </TabsTrigger>
            <TabsTrigger value="reconciliation" className="flex items-center gap-2">
              <AlertTriangle size={16} />
              Conciliación
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings size={16} />
              Ajustes
            </TabsTrigger>
            <TabsTrigger value="golive" className="flex items-center gap-2">
              <Rocket size={16} />
              Lanzamiento
            </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText size={16} />
                Contenido
              </TabsTrigger>
              <TabsTrigger value="discounts" className="flex items-center gap-2">
                <Tag size={16} />
                Descuentos
              </TabsTrigger>
              <TabsTrigger value="monetization" className="flex items-center gap-2">
                <CreditCard size={16} />
                Monetización
              </TabsTrigger>
          </TabsList>

          <TabsContent value="store">
            <AdminGuidesManager />
          </TabsContent>

          <TabsContent value="orders">
            <AllOrdersList />
          </TabsContent>

          <TabsContent value="sales">
            <AdminSalesReport />
          </TabsContent>

          <TabsContent value="users">
            <AllUsersList />
          </TabsContent>

          <TabsContent value="logs">
            <AccessLogsList />
          </TabsContent>

          <TabsContent value="reconciliation">
            <AdminPaymentReconciliation />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSiteSettings />
          </TabsContent>

          <TabsContent value="golive">
            <AdminGoLiveChecklist />
          </TabsContent>

            <TabsContent value="content">
              <AdminPageContent />
            </TabsContent>

            <TabsContent value="discounts">
              <AdminDiscountCodes />
            </TabsContent>

            <TabsContent value="monetization">
              <AdminMonetization />
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
