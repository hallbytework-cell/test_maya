import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import ProductDetailsLayout from "@/components/ProductDetailsLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import GlobalError from "./GlobalError";

import CategoryPageShimmer from "../components/shimmer/CategoryShimmer";
import HomeSkeleton from "../components/shimmer/HomeSkeleton";
import ProductPageShimmer from "@/components/shimmer/ProductPageShimmer";
import CheckoutShimmer from "@/components/shimmer/CheckoutShimmer";
import PlantCategoryManager from "@/components/PlantCategoryManager";
import OrderConfirmation from "../pages/checkout/OrderConfirmation";
import { lazyLoad } from "@/utils/lazyLoad";

const Home = lazyLoad(() => import("../pages/home/index"));
const CategoryPage = lazyLoad(() => import("../pages/category"));
const ProductPage = lazyLoad(() => import("../pages/product"));
const CheckoutPage = lazyLoad(() => import("../pages/checkout"));
const SearchPage = lazyLoad(() => import("../pages/search"));
const SeoSearchPage = lazyLoad(() => import("../pages/seo/search"));
const TrackingPage = lazyLoad(() => import("../pages/tracking"));
const Dashboard = lazyLoad(() => import("../pages/dashboard"));
const ChangePasswordPage = lazyLoad(() => import("../pages/changePassword"));
const LoginPage = lazyLoad(() => import("../pages/login"));
const SignupPage = lazyLoad(() => import("../pages/signup"));
const NotFound = lazyLoad(() => import("../pages/NotFound"));
const ServerError = lazyLoad(() => import("../pages/ServerError"));
const AboutPage = lazyLoad(() => import("../pages/about"));
const ContactUsPage = lazyLoad(() => import("../pages/contactUs"));
const ShippingPolicyPage = lazyLoad(() => import("../pages/shippingPolicy"));
const FAQPage = lazyLoad(() => import("../pages/faq"));
const ReturnPolicyPage = lazyLoad(() => import("../pages/return"));
const CookiesPolicyPage = lazyLoad(() => import("../pages/cookiesPolicy"))
const TermsConditionsPage = lazyLoad(() => import("../pages/termsConditions"))
const Profile =lazyLoad(()=>import("../pages/dashboard/Profile"))
const SettingPage =lazyLoad(()=>import("../pages/dashboard/SettingsPage"))
const OrdersPage =lazyLoad(()=>import("../pages/dashboard/OrdersPage"))
const AddressTab =lazyLoad(()=>import("../pages/dashboard/AddressTab"))
const BlogPage = lazyLoad(()=>import("../pages/home/Blogs"))

const Loadable = (Component, Fallback = <HomeSkeleton />) => (
  <Suspense fallback={Fallback}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  // 1. Standalone Layout (Product Details) - No Header/Footer
  {
    path: "/",
    element: <ProductDetailsLayout />,
    errorElement: <GlobalError />,
    children: [
      {
        path: "product/:slug/:productId",
        element: Loadable(ProductPage, <ProductPageShimmer />),
      },
    ],
  },
  // 2. Standalone Page (Checkout) - No Header/Footer
  {
    path: "checkout",
    errorElement: <GlobalError />,
    element: Loadable(CheckoutPage, <CheckoutShimmer />),
  },
  // 3. Main Layout (Home, Category, Profile, etc.) - With Header/Footer
  {
    path: "/",
    element: <Layout />,
    errorElement: <GlobalError />,
    children: [
      {
        index: true,
        element: Loadable(Home, <HomeSkeleton />)
      },
      { path: "track-order", element: Loadable(TrackingPage) },
      { path: "about", element: Loadable(AboutPage) },
       { path: "blog", element: Loadable(BlogPage) },
      // --- Public Auth Routes ---
      {
        element: <PublicRoute />,
        children: [
          { path: "login", element: Loadable(LoginPage) },
          { path: "signup", element: Loadable(SignupPage) },
        ],
      },

      // --- Protected User Routes ---
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: Loadable(Dashboard) },
          { path: "change-password", element: Loadable(ChangePasswordPage) },
          {
            path: "account",
            element: <Dashboard />, // Dashboard is now the Layout
            children: [
              {
                index: true, // This renders when path is exactly "/profile"
                path: "profile",
                element: <Profile />
              },
              {
                path: "orders", // Path: "/profile/orders"
                element: <OrdersPage />
              },
              {
                path: "address", // Path: "/profile/address"
                element: <AddressTab />
              },
              {
                path: "settings", // Path: "/profile/settings"
                element: <SettingPage />
              }
            ]
          }
        ],
      },
      { path: "search", element: Loadable(SearchPage, <CategoryPageShimmer />) },
      { path: "contact", element: Loadable(ContactUsPage, <CategoryPageShimmer />) },
      { path: "shipping-policy", element: Loadable(ShippingPolicyPage, <CategoryPageShimmer />) },
      { path: "faq", element: Loadable(FAQPage, <CategoryPageShimmer />) },
      { path: "return-policy", element: Loadable(ReturnPolicyPage, <CategoryPageShimmer />) },
      { path: "terms-conditions", element: Loadable(TermsConditionsPage, <CategoryPageShimmer />) },
      { path: "cookies-policy", element: Loadable(CookiesPolicyPage, <CategoryPageShimmer />) },
      { path: "plant/:slug?", element: Loadable(SeoSearchPage, <CategoryPageShimmer />) },
      { path: "order-confirm", element: <OrderConfirmation /> },

      // --- Campaign / Specific SEO Routes ---
      {
        path: "plants/:plantType",
        element: Loadable(PlantCategoryManager, <CategoryPageShimmer />)
      },
      // This catches "/indoor", "/pots", "/seeds"
      {
        path: "category/:category",
        element: Loadable(CategoryPage, <CategoryPageShimmer />)
      },

      // --- 404 Route ---
      { path: "*", element: Loadable(NotFound) },
    ],
  },
]);

export default router;