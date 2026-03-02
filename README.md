# ShopWave — Frontend E-commerce

Aplicación web de comercio electrónico construida con React 19, TypeScript y Vite. Integra la pasarela de pagos **Wompi** para Colombia y consume una API REST de NestJS desplegada en AWS.

---

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura](#arquitectura)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Páginas y Flujo de Usuario](#páginas-y-flujo-de-usuario)
6. [Gestión de Estado](#gestión-de-estado)
7. [Capa de Servicios](#capa-de-servicios)
8. [Variables de Entorno](#variables-de-entorno)
9. [Instalación y Desarrollo Local](#instalación-y-desarrollo-local)
10. [Build y Preview](#build-y-preview)
11. [Despliegue en AWS EC2](#despliegue-en-aws-ec2)
12. [Integración con Wompi](#integración-con-wompi)

---

## Descripción General

ShopWave es una SPA (Single Page Application) de e-commerce que permite a los usuarios:

- Explorar un catálogo de productos con filtros por categoría
- Ver el detalle de cada producto
- Gestionar un carrito de compras persistente en `localStorage`
- Completar un proceso de checkout en 3 pasos: datos personales → pago → confirmación
- Pagar con tarjeta de crédito/débito mediante Wompi
- Consultar el historial de pedidos por correo electrónico

---

## Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| UI Library | React | 19.2 |
| Lenguaje | TypeScript | 5.9 (strict mode) |
| Build Tool | Vite + SWC | 8.0 |
| Routing | React Router DOM | 7.13 |
| Estado global | Redux Toolkit | 2.11 |
| Estado servidor | TanStack React Query | 5.90 |
| Estado local | Zustand | 5.0 |
| HTTP Client | Axios | 1.13 |
| Estilos | CSS Modules | — |
| Componente tarjeta | react-credit-cards-2 | 1.2 |
| Pasarela de pago | Wompi API | v1 |

---

## Arquitectura

La aplicación sigue una arquitectura **Feature-Driven** (orientada a dominios), donde cada dominio del negocio es un módulo autocontenido. Los componentes compartidos, utilidades y servicios se centralizan en carpetas comunes.

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  React SPA (Vite)                        │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Pages   │  │ Features │  │  Shared  │              │
│  │  (rutas) │  │(dominios)│  │   (UI)   │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │              │              │                   │
│  ┌────▼──────────────▼──────────────▼─────┐            │
│  │            State Layer                  │            │
│  │  Redux Toolkit │ React Query │ Zustand  │            │
│  └────────────────┬────────────────────────┘            │
│                   │                                     │
│  ┌────────────────▼────────────────────────┐            │
│  │           Services Layer                │            │
│  │  Axios HTTP Client + Wompi REST API     │            │
│  └────────────────┬────────────────────────┘            │
└───────────────────┼─────────────────────────────────────┘
                    │ HTTPS
       ┌────────────┴────────────┐
       │                         │
┌──────▼──────┐         ┌────────▼────────┐
│  Backend    │         │  Wompi API      │
│  NestJS     │         │  (tokenización) │
│  (AWS EC2)  │         │  sandbox / prod │
└─────────────┘         └─────────────────┘
```

### Capas de la Aplicación

```
main.tsx
  └── Provider (Redux Store)
        └── QueryClientProvider (React Query)
              └── ToastProvider
                    └── App.tsx
                          └── AppRouter (React Router v7)
                                └── Pages
                                      └── Features (domain logic)
                                            └── Shared (components, hooks, utils)
                                                  └── Services (API calls)
```

---

## Estructura del Proyecto

```
frontend-ecommerce/
├── public/
├── src/
│   ├── config/                     # Configuración de entorno
│   │   ├── api.config.ts           # URL base de la API
│   │   └── wompi.config.ts         # Llave pública de Wompi
│   │
│   ├── features/                   # Módulos de dominio (Feature-Driven)
│   │   ├── cart/                   # Carrito de compras
│   │   │   ├── components/
│   │   │   │   ├── DiscountCodeInput/
│   │   │   │   └── EmptyCart/
│   │   │   └── hooks/
│   │   │       └── useCart.ts      # Lógica: subtotal, descuentos, totales
│   │   │
│   │   ├── catalog/                # Catálogo de productos
│   │   │   ├── components/
│   │   │   │   ├── CategoryChips/  # Chips de filtro por categoría
│   │   │   │   ├── HeroBanner/     # Banner principal de la home
│   │   │   │   └── ProductGrid/    # Grid responsive de productos
│   │   │   │       └── ProductCard/
│   │   │   ├── hooks/
│   │   │   │   ├── useFilters.ts   # Filtrado por categoría y búsqueda
│   │   │   │   └── useProducts.ts  # Fetch de productos vía React Query
│   │   │   └── types/
│   │   │       └── product.types.ts
│   │   │
│   │   ├── checkout/               # Proceso de checkout
│   │   │   ├── components/
│   │   │   │   └── StepIndicator/  # Indicador de pasos del flujo
│   │   │   └── hooks/
│   │   │       └── useCheckout.ts
│   │   │
│   │   ├── order-confirmation/     # Confirmación de orden
│   │   │   ├── components/
│   │   │   │   ├── DeclinedState/  # Vista cuando el pago es rechazado
│   │   │   │   ├── PendingState/   # Vista cuando el pago está pendiente
│   │   │   │   └── SuccessState/   # Vista cuando el pago es aprobado
│   │   │   └── hooks/
│   │   │       └── useTransactionStatus.ts
│   │   │
│   │   ├── payment/                # Procesamiento de pagos
│   │   │   ├── components/
│   │   │   │   └── ProcessingOverlay/  # Overlay de carga durante pago
│   │   │   └── hooks/
│   │   │       ├── useCardTokenization.ts
│   │   │       └── usePayment.ts
│   │   │
│   │   └── product-detail/         # Detalle de producto
│   │       ├── components/
│   │       │   ├── ImageGallery/
│   │       │   └── QuantityStepper/
│   │       └── hooks/
│   │           └── useProductDetail.ts
│   │
│   ├── pages/                      # Páginas completas (una por ruta)
│   │   ├── Home/
│   │   │   └── HomePage.tsx
│   │   ├── Cart/
│   │   │   ├── CartPage.tsx
│   │   │   └── CartPage.module.css
│   │   ├── Checkout/
│   │   │   ├── CheckoutPage.tsx
│   │   │   └── CheckoutPage.module.css
│   │   ├── ProducDetail/
│   │   │   ├── ProductDetailPage.tsx
│   │   │   └── ProductDetailPage.module.css
│   │   ├── Payments/
│   │   │   ├── PaymentPage.tsx
│   │   │   └── PaymentPage.module.css
│   │   └── Order/
│   │       ├── Confirmed/
│   │       │   ├── OrderConfirmedPage.tsx
│   │       │   └── OrderConfirmedPage.module.css
│   │       └── Orders/
│   │           ├── OrdersPage.tsx
│   │           └── OrdersPage.module.css
│   │
│   ├── router/
│   │   └── AppRouter.tsx           # Definición de todas las rutas SPA
│   │
│   ├── services/                   # Capa de comunicación con la API
│   │   ├── http.client.ts          # Instancia Axios + interceptores de error
│   │   ├── products.service.ts
│   │   ├── customers.service.ts
│   │   ├── payments.service.ts
│   │   ├── transactions.service.ts
│   │   ├── discount-codes.service.ts
│   │   └── wompi.service.ts        # Tokenización de tarjeta directa a Wompi
│   │
│   ├── shared/                     # Código reutilizable entre features
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar/         # Barra de navegación principal
│   │   │   │   ├── Footer/         # Pie de página
│   │   │   │   └── PageWrapper/    # Wrapper con flex layout
│   │   │   └── ui/
│   │   │       ├── Badge/
│   │   │       ├── Button/
│   │   │       ├── Input/
│   │   │       ├── Modal/
│   │   │       ├── Skeleton/       # Placeholder de carga
│   │   │       └── Toast/          # Notificaciones (ToastProvider)
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts      # Debounce para búsquedas
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useToast.ts         # Disparar toasts desde cualquier componente
│   │   ├── types/
│   │   │   ├── api.types.ts        # ApiError, respuestas genéricas
│   │   │   └── common.types.ts     # TransactionStatus, LoadingState
│   │   └── utils/
│   │       ├── cn.ts               # Utilidad para combinar classNames
│   │       ├── currency.ts         # formatCOP, toCents, fromCents
│   │       └── validators.ts
│   │
│   ├── store/                      # Gestión de estado global
│   │   ├── store.ts                # Redux store + persistencia en localStorage
│   │   ├── cartSlice.ts            # Redux Toolkit slice del carrito
│   │   ├── cart.store.ts           # Zustand store alternativo del carrito
│   │   ├── auth.store.ts           # Zustand store de autenticación
│   │   └── checkout.store.ts       # Zustand store del checkout
│   │
│   ├── App.tsx                     # Componente raíz
│   ├── main.tsx                    # Entry point con todos los providers
│   └── index.css                   # Estilos globales y reset
│
├── .env                            # Variables de entorno (NO commitear)
├── .env.example                    # Plantilla de variables de entorno
├── vite.config.ts                  # Configuración de Vite + plugin React SWC
├── tsconfig.json
├── tsconfig.app.json               # Config TypeScript para la app (strict)
└── package.json
```

---

## Páginas y Flujo de Usuario

### Rutas disponibles

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | HomePage | Catálogo con hero banner, chips de categoría y grid de productos |
| `/product/:id` | ProductDetailPage | Detalle del producto, galería de imágenes y stepper de cantidad |
| `/cart` | CartPage | Items del carrito, validación de descuentos y resumen de compra |
| `/checkout` | CheckoutPage | Formulario de datos personales, dirección de envío y método de entrega |
| `/payment` | PaymentPage | Formulario de tarjeta con visualización animada (react-credit-cards-2) |
| `/order-confirmed` | OrderConfirmedPage | Resultado de la transacción + redirect automático a inicio en 60s |
| `/orders` | OrdersPage | Historial de pedidos consultados por correo electrónico |

### Flujo de Compra Completo

```
HomePage  ──(agregar al carrito)──▶  CartPage
                                         │
                                    (ir a checkout)
                                         │
                                         ▼
                                    CheckoutPage
                                         │
                              ┌──────────┴──────────┐
                              │   Lookup por email   │
                              │  GET /customers?     │
                              │  email=...           │
                              │                      │
                        (cliente existente)   (cliente nuevo)
                              │                      │
                              │               POST /customers
                              └──────────┬───────────┘
                                         │
                              navigate('/payment', {
                                customerData, shippingCost
                              })
                                         │
                                         ▼
                                    PaymentPage
                                         │
                              1. POST Wompi /tokens/cards
                              2. POST /api/v1/payments
                                         │
                                         ▼
                                 OrderConfirmedPage
                                         │
                              ┌──────────┴──────────┐
                              │  dispatch(clearCart) │
                              │  countdown 60s → /   │
                              └──────────────────────┘
```

---

## Gestión de Estado

El proyecto usa **tres** soluciones de estado con responsabilidades bien definidas:

### 1. Redux Toolkit — Carrito (persistente en localStorage)

Clave de almacenamiento: `shopwave_cart`

| Acción | Descripción |
|--------|-------------|
| `addItem` | Agrega un producto o incrementa su cantidad |
| `removeItem` | Elimina un producto del carrito |
| `updateQuantity` | Actualiza la cantidad (elimina si qty ≤ 0) |
| `applyDiscount` | Aplica código de descuento con porcentaje |
| `clearDiscount` | Elimina el descuento activo |
| `clearCart` | Vacía el carrito completamente |

```typescript
// Uso desde cualquier componente
const dispatch = useDispatch<AppDispatch>();
dispatch(addItem({ product, quantity: 1 }));
dispatch(clearCart());
```

### 2. TanStack React Query — Estado del Servidor

Gestiona fetching, caching e invalidación de productos y datos remotos.

```typescript
// Configuración en main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});
```

### 3. Zustand — Estado de Features

Maneja estado local de UI y sesión en `cart.store.ts`, `auth.store.ts` y `checkout.store.ts`.

---

## Capa de Servicios

Todos los servicios usan la instancia centralizada de Axios configurada en `http.client.ts`.

### Configuración del cliente HTTP

```typescript
// src/config/api.config.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
export const API_URL = `${API_BASE_URL}/api/v1`;
```

### Servicios disponibles

| Servicio | Endpoints |
|----------|-----------|
| `products.service.ts` | `GET /products`, `GET /products/:id` |
| `customers.service.ts` | `POST /customers`, `GET /customers?email=`, `GET /customers/:id`, `PUT /customers/:id` |
| `payments.service.ts` | `POST /payments`, `GET /payments/:id`, `GET /payments/customer/:email`, `POST /payments/:id/sync` |
| `discount-codes.service.ts` | `GET /discount-codes/validate?code=` |
| `wompi.service.ts` | `POST Wompi /tokens/cards` (directo, sin backend) |

### CustomerDto (payload de cliente)

```typescript
interface CustomerDto {
  email:      string;
  fullName:   string;
  phone:      string;   // formato internacional: +573001234567
  address:    string;
  city:       string;
  country:    string;   // código ISO 3166-1 alpha-2: 'CO'
  postalCode: string;   // 6 dígitos — requerido por Wompi
}
```

### CreatePaymentDto (payload de pago)

```typescript
interface CreatePaymentDto {
  customer:      CustomerDto;
  products:      { productId: string; quantity: number }[];
  cardToken:     string;        // token generado por Wompi (tok_...)
  installments?: number;        // número de cuotas (1, 3, 6, 12...)
  discountCode?: string;
  sandboxStatus?: 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING';
}
```

---

## Variables de Entorno

Crea un archivo `.env` en la raíz basándote en `.env.example`:

```env
# URL del backend NestJS (sin trailing slash)
VITE_API_URL=http://localhost:3000

# Llave pública de Wompi
# Staging:     pub_stagtest_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
# Sandbox:     pub_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
# Producción:  pub_prod_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_WOMPI_PUBLIC_KEY=pub_stagtest_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

> Las variables deben comenzar con `VITE_` para ser expuestas al bundle del cliente por Vite.

---

## Instalación y Desarrollo Local

### Requisitos

- Node.js >= 18
- npm >= 9

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd frontend-ecommerce

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores correspondientes

# 4. Iniciar el servidor de desarrollo
npm run dev
# Disponible en: http://localhost:5173
```

### Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR (Hot Module Replacement) |
| `npm run build` | Verificación de tipos + bundle de producción en `/dist` |
| `npm run preview` | Previsualizar el build de producción en local |
| `npm run lint` | Ejecutar ESLint con reglas de React Hooks |

---

## Build y Preview

```bash
# Generar build optimizado para producción
npm run build
# Salida en: dist/

# Previsualizar localmente antes de desplegar
npm run preview
# Disponible en: http://localhost:4173
```

El comando `build` ejecuta:
1. `tsc -b` — verificación estática de tipos TypeScript
2. `vite build` — bundling con tree-shaking, code splitting y optimización de assets

---

## Despliegue en AWS EC2

### Infraestructura

```
Internet
    │  (puerto 80 / 443)
    ▼
┌────────────────────────────────────────────────┐
│                  AWS Cloud                     │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │          EC2 Instance                    │  │
│  │        (Ubuntu 22.04 LTS)                │  │
│  │                                          │  │
│  │  ┌──────────────┐   ┌─────────────────┐  │  │
│  │  │    Nginx     │   │ Archivos        │  │  │
│  │  │  Reverse     │──▶│ estáticos SPA   │  │  │
│  │  │  Proxy       │   │ /var/www/       │  │  │
│  │  │  puerto 80   │   │ shopwave/       │  │  │
│  │  │  puerto 443  │   │ (dist/ de Vite) │  │  │
│  │  └──────────────┘   └─────────────────┘  │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  Security Group Inbound Rules:                 │
│    Puerto 22  → SSH (solo tu IP)               │
│    Puerto 80  → HTTP (0.0.0.0/0)               │
│    Puerto 443 → HTTPS (0.0.0.0/0)              │
└────────────────────────────────────────────────┘
```

---

### Paso 1 — Preparar la instancia EC2

```bash
# Conectarse por SSH
ssh -i "tu-llave.pem" ubuntu@<IP-PUBLICA-EC2>

# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar
node -v    # v20.x.x
npm -v     # 10.x.x

# Instalar Nginx
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

### Paso 2 — Obtener el código y compilar

**Opción A: Clonar el repositorio directamente en EC2 (recomendado)**

```bash
# En la instancia EC2
cd /home/ubuntu
git clone <url-del-repositorio> frontend-ecommerce
cd frontend-ecommerce

# Crear las variables de entorno de producción
cat > .env << 'EOF'
VITE_API_URL=http://<IP-O-DOMINIO-DEL-BACKEND>:3000
VITE_WOMPI_PUBLIC_KEY=pub_prod_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
EOF

# Instalar dependencias y compilar
npm install
npm run build
# Genera: /home/ubuntu/frontend-ecommerce/dist/
```

**Opción B: Subir el build desde tu máquina local**

```bash
# En tu máquina local
npm run build

# Transferir a EC2
scp -i "tu-llave.pem" -r dist/ ubuntu@<IP-PUBLICA-EC2>:/home/ubuntu/shopwave-dist/
```

---

### Paso 3 — Configurar Nginx

```bash
# Crear el directorio de la app
sudo mkdir -p /var/www/shopwave

# Copiar los archivos del build
sudo cp -r /home/ubuntu/frontend-ecommerce/dist/* /var/www/shopwave/

# Ajustar permisos para Nginx
sudo chown -R www-data:www-data /var/www/shopwave
sudo chmod -R 755 /var/www/shopwave
```

Crear la configuración de Nginx:

```bash
sudo nano /etc/nginx/sites-available/shopwave
```

```nginx
server {
    listen 80;
    server_name <IP-PUBLICA-EC2>;   # o tu dominio: shopwave.ejemplo.com

    root /var/www/shopwave;
    index index.html;

    # Compresión gzip para assets estáticos
    gzip on;
    gzip_vary on;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        image/svg+xml;

    # Cabeceras de seguridad
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Cache agresivo para assets con hash en el nombre (Vite los versiona)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback — todas las rutas apuntan a index.html (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Activar la configuración
sudo ln -s /etc/nginx/sites-available/shopwave /etc/nginx/sites-enabled/

# Desactivar la configuración por defecto
sudo rm /etc/nginx/sites-enabled/default

# Verificar la sintaxis
sudo nginx -t
# Salida esperada: syntax is ok / test is successful

# Recargar Nginx
sudo systemctl reload nginx
```

---

### Paso 4 — Reglas del Security Group (AWS Console)

En **AWS Console → EC2 → Security Groups → Inbound Rules**:

| Tipo | Protocolo | Rango de puertos | Origen |
|------|-----------|-----------------|--------|
| SSH | TCP | 22 | Mi IP (recomendado) |
| HTTP | TCP | 80 | 0.0.0.0/0, ::/0 |
| HTTPS | TCP | 443 | 0.0.0.0/0, ::/0 |

---

### Paso 5 — (Opcional) HTTPS con Let's Encrypt

Requiere que tengas un dominio apuntando a la IP pública de la EC2.

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener el certificado SSL
sudo certbot --nginx -d shopwave.ejemplo.com

# Certbot modifica automáticamente la configuración de Nginx
# y configura la renovación automática

# Verificar renovación automática
sudo systemctl status certbot.timer
```

---

### Paso 6 — Script de despliegue automatizado

Guardar en `/home/ubuntu/deploy.sh`:

```bash
#!/bin/bash
set -e

APP_DIR="/home/ubuntu/frontend-ecommerce"
WEB_DIR="/var/www/shopwave"

echo "==> Actualizando código fuente..."
cd $APP_DIR
git pull origin main

echo "==> Instalando dependencias..."
npm ci

echo "==> Generando build de producción..."
npm run build

echo "==> Desplegando archivos estáticos..."
sudo cp -r dist/* $WEB_DIR/
sudo chown -R www-data:www-data $WEB_DIR

echo "==> Recargando Nginx..."
sudo systemctl reload nginx

echo "✅ Despliegue completado: $(date)"
```

```bash
chmod +x /home/ubuntu/deploy.sh
./deploy.sh
```

---

### Paso 7 — Verificación

```bash
# Estado de Nginx
sudo systemctl status nginx

# Verificar que responde
curl -I http://<IP-PUBLICA-EC2>
# Esperado: HTTP/1.1 200 OK

# Logs en tiempo real
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## Integración con Wompi

Wompi es el procesador de pagos para Colombia. La integración sigue el flujo de **tokenización del lado del cliente**, lo que garantiza que los datos de la tarjeta nunca pasan por el backend propio.

### Flujo de Tokenización

```
PaymentPage (Frontend)               Wompi API
      │                                   │
      │  1. POST /v1/tokens/cards         │
      │     Authorization: Bearer         │
      │     <VITE_WOMPI_PUBLIC_KEY>        │
      │     { number, cvc, exp_month,     │
      │       exp_year, card_holder }     │
      │──────────────────────────────────▶│
      │                                   │
      │  2. 200 OK                        │
      │     { data: { id: "tok_..." } }   │
      │◀──────────────────────────────────│
      │                                   │
      │  3. POST /api/v1/payments         │
      │     { customer, products,         │
      │       cardToken: "tok_...",       │    Backend NestJS
      │       installments }              │──▶ (procesa pago con
      │──────────────────────────────────▶│    Wompi server-side)
      │                                   │
      │  4. PaymentResponseDto            │
      │◀──────────────────────────────────│
      ▼
OrderConfirmedPage
```

### Ambientes de Wompi

El servicio detecta automáticamente el ambiente según el prefijo de la llave pública:

| Prefijo de la llave | Ambiente | URL de la API |
|---------------------|----------|---------------|
| `pub_stagtest_` | Staging test | `https://api-sandbox.co.uat.wompi.dev/v1` |
| `pub_test_` | Sandbox | `https://sandbox.wompi.co/v1` |
| Cualquier otro | Producción | `https://production.wompi.co/v1` |

### Tarjetas de Prueba (Sandbox)

| Número de tarjeta | Red | Resultado por defecto |
|-------------------|-----|-----------------------|
| `4242 4242 4242 4242` | Visa | APPROVED |
| `5105 1051 0510 5100` | Mastercard | APPROVED |
| `3714 496353 98431` | Amex | APPROVED |

> Usa cualquier fecha de expiración futura y cualquier CVV de 3 dígitos (4 para Amex).

> En sandbox puedes forzar el resultado enviando el campo `sandboxStatus: 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING'` en el payload de creación de pago.

---

## Notas Importantes de Producción

- **Variables de entorno**: Nunca incluyas llaves de producción de Wompi en el repositorio. Usa variables de sistema en EC2 o **AWS Parameter Store**.
- **CORS**: Configura el backend NestJS para aceptar solicitudes desde el dominio o IP pública donde está desplegado el frontend.
- **Código postal**: Wompi requiere `postalCode` en los datos del cliente. El campo es obligatorio en el formulario de checkout.
- **Cache de Nginx**: Vite genera los assets con hashes únicos en el nombre del archivo. La estrategia `Cache-Control: immutable` es segura y mejora el rendimiento en actualizaciones.
- **SPA Fallback**: La directiva `try_files $uri $uri/ /index.html` en Nginx es esencial para que React Router v7 maneje las rutas del lado del cliente correctamente.
