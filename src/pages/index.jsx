import Layout from "./Layout.jsx";

import Home from "./Home";

import Profile from "./Profile";

import Wines from "./Wines";

import TastingBoxes from "./TastingBoxes";

import Events from "./Events";

import Wineries from "./Wineries";

import WineryDetails from "./WineryDetails";

import WineDetails from "./WineDetails";

import WineriesMap from "./WineriesMap";

import Discover from "./Discover";

import AdminMedia from "./AdminMedia";

import AdminImages from "./AdminImages";

import AdminVideos from "./AdminVideos";

import AdminData from "./AdminData";

import EventDetails from "./EventDetails";

import AdminTastingBoxes from "./AdminTastingBoxes";

import WineryDashboard from "./WineryDashboard";

import WineryAccount from "./WineryAccount";

import SplashScreen from "./SplashScreen";

import AdminSplashVideo from "./AdminSplashVideo";

import Onboarding from "./Onboarding";

import AdminImport from "./AdminImport";

import AdminDashboard from "./AdminDashboard";

import WineryProfile from "./WineryProfile";

import WineryWines from "./WineryWines";

import WineryOrders from "./WineryOrders";

import AdminContentHome from "./AdminContentHome";

import WineryLogin from "./WineryLogin";

import WineryWineManager from "./WineryWineManager";

import Checkout from "./Checkout";

import OrderConfirmation from "./OrderConfirmation";

import AdminOrders from "./AdminOrders";

import UserOrders from "./UserOrders";

import UserLogin from "./UserLogin";

import PrivacyPolicy from "./PrivacyPolicy";

import TermsOfService from "./TermsOfService";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Profile: Profile,
    
    Wines: Wines,
    
    TastingBoxes: TastingBoxes,
    
    Events: Events,
    
    Wineries: Wineries,
    
    WineryDetails: WineryDetails,
    
    WineDetails: WineDetails,
    
    WineriesMap: WineriesMap,
    
    Discover: Discover,
    
    AdminMedia: AdminMedia,
    
    AdminImages: AdminImages,
    
    AdminVideos: AdminVideos,
    
    AdminData: AdminData,
    
    EventDetails: EventDetails,
    
    AdminTastingBoxes: AdminTastingBoxes,
    
    WineryDashboard: WineryDashboard,
    
    WineryAccount: WineryAccount,
    
    SplashScreen: SplashScreen,
    
    AdminSplashVideo: AdminSplashVideo,
    
    Onboarding: Onboarding,
    
    AdminImport: AdminImport,
    
    AdminDashboard: AdminDashboard,
    
    WineryProfile: WineryProfile,
    
    WineryWines: WineryWines,
    
    WineryOrders: WineryOrders,
    
    AdminContentHome: AdminContentHome,
    
    WineryLogin: WineryLogin,
    
    WineryWineManager: WineryWineManager,
    
    Checkout: Checkout,
    
    OrderConfirmation: OrderConfirmation,
    
    AdminOrders: AdminOrders,
    
    UserOrders: UserOrders,
    
    UserLogin: UserLogin,
    
    PrivacyPolicy: PrivacyPolicy,
    
    TermsOfService: TermsOfService,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Wines" element={<Wines />} />
                
                <Route path="/TastingBoxes" element={<TastingBoxes />} />
                
                <Route path="/Events" element={<Events />} />
                
                <Route path="/Wineries" element={<Wineries />} />
                
                <Route path="/WineryDetails" element={<WineryDetails />} />
                
                <Route path="/WineDetails" element={<WineDetails />} />
                
                <Route path="/WineriesMap" element={<WineriesMap />} />
                
                <Route path="/Discover" element={<Discover />} />
                
                <Route path="/AdminMedia" element={<AdminMedia />} />
                
                <Route path="/AdminImages" element={<AdminImages />} />
                
                <Route path="/AdminVideos" element={<AdminVideos />} />
                
                <Route path="/AdminData" element={<AdminData />} />
                
                <Route path="/EventDetails" element={<EventDetails />} />
                
                <Route path="/AdminTastingBoxes" element={<AdminTastingBoxes />} />
                
                <Route path="/WineryDashboard" element={<WineryDashboard />} />
                
                <Route path="/WineryAccount" element={<WineryAccount />} />
                
                <Route path="/SplashScreen" element={<SplashScreen />} />
                
                <Route path="/AdminSplashVideo" element={<AdminSplashVideo />} />
                
                <Route path="/Onboarding" element={<Onboarding />} />
                
                <Route path="/AdminImport" element={<AdminImport />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/WineryProfile" element={<WineryProfile />} />
                
                <Route path="/WineryWines" element={<WineryWines />} />
                
                <Route path="/WineryOrders" element={<WineryOrders />} />
                
                <Route path="/AdminContentHome" element={<AdminContentHome />} />
                
                <Route path="/WineryLogin" element={<WineryLogin />} />
                
                <Route path="/WineryWineManager" element={<WineryWineManager />} />
                
                <Route path="/Checkout" element={<Checkout />} />
                
                <Route path="/OrderConfirmation" element={<OrderConfirmation />} />
                
                <Route path="/AdminOrders" element={<AdminOrders />} />
                
                <Route path="/UserOrders" element={<UserOrders />} />
                
                <Route path="/UserLogin" element={<UserLogin />} />
                
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                
                <Route path="/TermsOfService" element={<TermsOfService />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}