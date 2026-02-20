# Guía de Configuración de Supabase - mpachi-web

## 📋 Estado Actual
✅ `@supabase/supabase-js` ya está instalado (v2.97.0)  
✅ `supabaseClient.ts` está correctamente configurado  
✅ Archivo `.env` creado

## 🚀 Pasos de Configuración

### 1. Configurar Variables de Entorno

**Archivo: `.env`**

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_url_de_supabase
VITE_SUPABASE_ANON_KEY=your_anon_key
```

📌 **Cómo obtener estas credenciales:**
1. Ve a [app.supabase.com](https://app.supabase.com/)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### 2. Cliente de Supabase

**Archivo: `supabaseClient.ts`**

El archivo ya está correctamente configurado:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3. Crear Tablas en la Base de Datos

Ejecuta los siguientes comandos SQL en el **SQL Editor** de Supabase:

#### 3.1 Tabla `profiles` (Perfiles de Usuario)

```sql
-- Crear tabla profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  UNIQUE(email)
);

-- Crear índices para mejorar performance
CREATE INDEX idx_profiles_email ON public.profiles (email);
CREATE INDEX idx_profiles_role ON public.profiles (role);

-- Crear trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER profiles_updated_at_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_profiles_updated_at();

-- Habilitar RLS en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política RLS: Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Política RLS: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política RLS: Los admins pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Política RLS: Permitir inserciones de usuarios autenticados
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);
```

#### 3.2 Tabla `guides` (Guías/Productos)

```sql
CREATE TABLE IF NOT EXISTS public.guides (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  image_url TEXT,
  category TEXT,
  author_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  is_published BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  CONSTRAINT guides_title_unique UNIQUE (title)
);

-- Índices
CREATE INDEX idx_guides_author_id ON public.guides (author_id);
CREATE INDEX idx_guides_category ON public.guides (category);
CREATE INDEX idx_guides_is_published ON public.guides (is_published);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_guides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER guides_updated_at_trigger
BEFORE UPDATE ON public.guides
FOR EACH ROW
EXECUTE FUNCTION public.update_guides_updated_at();

-- Habilitar RLS
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- Política RLS: Ver guías publicadas para todos
CREATE POLICY "Anyone can view published guides"
ON public.guides
FOR SELECT
USING (is_published = TRUE);

-- Política RLS: Autores pueden ver sus propias guías
CREATE POLICY "Authors can view own guides"
ON public.guides
FOR SELECT
USING (auth.uid() = author_id);

-- Política RLS: Autores pueden actualizar sus propias guías
CREATE POLICY "Authors can update own guides"
ON public.guides
FOR UPDATE
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Política RLS: Autores pueden crear guías
CREATE POLICY "Authenticated users can create guides"
ON public.guides
FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- Política RLS: Admins pueden modificar cualquier guía
CREATE POLICY "Admins can manage guides"
ON public.guides
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

#### 3.3 Tabla `orders` (Pedidos)

```sql
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_postal_code TEXT,
  shipping_country TEXT,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  CONSTRAINT orders_total_positive CHECK (total_amount > 0)
);

-- Índices
CREATE INDEX idx_orders_user_id ON public.orders (user_id);
CREATE INDEX idx_orders_status ON public.orders (status);
CREATE INDEX idx_orders_created_at ON public.orders (created_at DESC);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER orders_updated_at_trigger
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_orders_updated_at();

-- Habilitar RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Política RLS: Los usuarios pueden ver sus propios pedidos
CREATE POLICY "Users can view own orders"
ON public.orders
FOR SELECT
USING (auth.uid() = user_id);

-- Política RLS: Los usuarios pueden crear sus propios pedidos
CREATE POLICY "Users can create own orders"
ON public.orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política RLS: Los usuarios pueden actualizar sus propios pedidos (solo si están en estado pending)
CREATE POLICY "Users can update own pending orders"
ON public.orders
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id);

-- Política RLS: Los admins pueden ver todos los pedidos
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Política RLS: Los admins pueden actualizar cualquier pedido
CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

#### 3.4 Tabla `order_items` (Items del Pedido)

```sql
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  order_id UUID NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  guide_id UUID NOT NULL REFERENCES public.guides (id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  CONSTRAINT order_items_quantity_positive CHECK (quantity > 0),
  CONSTRAINT order_items_price_positive CHECK (unit_price > 0)
);

-- Índices
CREATE INDEX idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX idx_order_items_guide_id ON public.order_items (guide_id);

-- Habilitar RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Política RLS: Los usuarios pueden ver items de sus propios pedidos
CREATE POLICY "Users can view own order items"
ON public.order_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- Política RLS: Los usuarios pueden crear items en sus propios pedidos
CREATE POLICY "Users can create items in own orders"
ON public.order_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- Política RLS: Los admins pueden ver todos los items
CREATE POLICY "Admins can view all order items"
ON public.order_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

#### 3.5 Tabla `access_logs` (Registro de Acceso)

```sql
CREATE TABLE IF NOT EXISTS public.access_logs (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  status_code INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_access_logs_user_id ON public.access_logs (user_id);
CREATE INDEX idx_access_logs_created_at ON public.access_logs (created_at DESC);
CREATE INDEX idx_access_logs_action ON public.access_logs (action);
CREATE INDEX idx_access_logs_resource_type ON public.access_logs (resource_type);

-- Habilitar RLS
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

-- Política RLS: Los usuarios pueden ver sus propios logs
CREATE POLICY "Users can view own access logs"
ON public.access_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Política RLS: Los admins pueden ver todos los logs
CREATE POLICY "Admins can view all access logs"
ON public.access_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Política RLS: El sistema puede insertar logs
CREATE POLICY "System can insert access logs"
ON public.access_logs
FOR INSERT
WITH CHECK (TRUE);
```

---

## 🔐 Autenticación con Supabase

### Configurar Email/Password Authentication - Pasos Detallados

1. **Ve a tu proyecto en Supabase:** https://app.supabase.com/
2. **Navega a:** `Authentication` → `Providers` (en el menú lateral izquierdo)
3. **Busca "Email"** en la lista de proveedores
4. **Haz clic en el provider "Email"** para expandir las opciones
5. **Habilita el toggles:**
   - ✅ **Enable Email provider** (activa el proveedor)
   - ✅ **Enable email confirmations** (confirmación por email - recomendado)
   - ✅ **Enable password reset** (permitir recuperación de contraseña)
6. **Configura el Site URL:**
   - Ve a `Authentication` → `URL Configuration`
   - En **Redirect URL**, asegúrate que contiene: `http://localhost:5173` (desarrollo)
   - Para producción: `https://tu-dominio.com`
7. **Guarda los cambios**

### Configuración de Emails (Opcional pero Recomendado)

Si deseas enviar emails personalizados:
1. Ve a `Authentication` → `Email Templates`
2. Configura las plantillas para:
   - Confirmación de email
   - Recuperación de contraseña
   - Cambio de email

### Ejemplo de Hook para Autenticación

Crea `src/hooks/useAuth.ts`:

```typescript
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/supabaseClient';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener usuario actual
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    return supabase.auth.signUp({ email, password });
  };

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  return { user, loading, signUp, signIn, signOut };
};
```

---

## 📦 Instalar CLI de Supabase

Para gestionar migraciones locales:

```bash
npm install --global supabase
# o con bun
bun add -g supabase
```

Inicializar migraciones:

```bash
supabase init
```

---

## ✅ Checklist de Configuración

- [x] Copiar credenciales de Supabase al archivo `.env`
- [x] Crear hook `useAuth.ts` para autenticación
- [x] Instalar Supabase CLI localmente
- [x] Inicializar `supabase init`
- [x] Vincular proyecto remoto con CLI local (`supabase link`)
- [x] Ejecutar los scripts SQL en el SQL Editor de Supabase
- [x] Habilitar Email Authentication en Settings
- [x] Configurar URL de redirección
- [x] **PASO 1**: Integrar AuthForm en la app (página `/auth`)
- [x] **PASO 2**: Crear rutas protegidas y contexto global de autenticación
- [x] **PASO 3**: Implementar perfil de usuario (editar con formulario)
- [x] **PASO 4**: Dashboard avanzado (pedidos y guías)
- [ ] **PASO 5**: Configurar roles y permisos de admin

---

## 🧪 Probar la Conexión

En tu componente, puedes probar así:

```typescript
import { supabase } from '@/supabaseClient';

async function testConnection() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Conexión exitosa:', data);
  }
}
```

---

## 📚 Documentación Oficial

- [Supabase Docs](https://supabase.com/docs)
- [Auth with Supabase](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
