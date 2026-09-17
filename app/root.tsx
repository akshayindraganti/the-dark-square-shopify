import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import type {Route} from './+types/root';
import tdsStyles from '~/styles/tds/main.css?url';
import {SiteLayout} from '~/components/tds/SiteLayout';
import {loadStoreCatalogue} from '~/lib/tds/shopify';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  return false;
};

export function links() {
  return [
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    {rel: 'preconnect', href: 'https://shop.app'},
    {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous'},
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Lato:ital,wght@0,300;0,400;0,700;1,400&family=Caveat:wght@500;600&display=swap',
    },
    {rel: 'icon', type: 'image/jpeg', href: '/assets/logo.jpg'},
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const {storefront, env, cart} = args.context;

  /**
   * The cart is awaited rather than deferred.
   *
   * Hydrogen's scaffold streams it, because its layout only needs it inside an
   * aside. Here the count sits in the header on every page and the drawer can
   * be opened before anything below the fold has rendered, so the whole site
   * would be waiting on the same promise anyway — awaiting it keeps one source
   * of truth and avoids a Suspense boundary wrapped around every page.
   */
  const [currentCart, store] = await Promise.all([
    cart.get(),
    loadStoreCatalogue(storefront),
  ]);

  return {
    cart: currentCart,
    /** The store's half of the catalogue: empty until products exist. */
    store,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tdsStyles}></link>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider cart={data.cart} shop={data.shop} consent={data.consent}>
      <SiteLayout cart={data.cart} store={data.store}>
        <Outlet />
      </SiteLayout>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <main className="prose-page">
      <p className="page-kicker">Something went wrong</p>
      <h1 className="page-title">{errorStatus}</h1>
      {errorMessage && <p>{errorMessage}</p>}
    </main>
  );
}
