import React, { useContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BiobukContext } from "../context/BiobukContext";
import { Col, Container, Row } from "react-bootstrap";
import { BiobukNavbar } from "../components/Navbar/BiobukNavbar";
import { BiobukFooter } from "../components/Footer/BiobukFooter";
import { BiobukSidebar } from "../components/Sidebar/BiobukSidebar";
import { Home } from "../pages/Dashboard/Home/Home";
import { About } from "../pages/Dashboard/About/About";
import { Register } from "../pages/Auth/Register";
import { Login } from "../pages/Auth/Login";
import { ProductsList } from "../pages/Dashboard/Products/ProductsList";
import { OneProduct } from "../pages/Dashboard/Products/OneProduct";
import { EditFarmerProfile } from "../pages/Dashboard/Farmer/EditFarmerProfile";
import { AllGreenhouses } from "../pages/Dashboard/Greenhouses/AllGreenhouses";
import { CreateGreenhouse } from "../pages/Dashboard/Greenhouses/CreateGreenhouse";
import { EditGreenhouse } from "../pages/Dashboard/Greenhouses/EditGreenhouse";
import { OneGreenhouse } from "../pages/Dashboard/Greenhouses/OneGreenhouse";
import { AllFarmers } from "../pages/Admin/AllFarmers";
import { ShopProfile } from "../pages/Dashboard/Shop/ShopProfile";
import { FarmerProfile } from "../pages/Dashboard/Farmer/FarmerProfile";
import { AdminProfile } from "../pages/Admin/AdminProfile";
import { Error } from "../pages/Dashboard/Error/Error";
import { MyShops } from "../pages/Dashboard/Shop/MyShops";
import { ShopInfo } from "../pages/Dashboard/Shop/ShopInfo";
import { EditShopProfile } from "../pages/Dashboard/Shop/EditShopProfile";
import { AdminAllGreenhouses } from "../pages/Admin/AdminAllGreenhouses";
import { ShoppingCart } from "../pages/Dashboard/Farmer/ShoppingCart";
import { ConfirmPurchase } from "../pages/Dashboard/Farmer/ConfirmPurchase";
import { OrderList } from "../pages/Dashboard/Farmer/OrderList";
import { OneOrder } from "../pages/Dashboard/Farmer/OneOrder";
import { ShopOrders } from "../pages/Dashboard/ShopOwner/ShopOrders";
import { ShopOneOrder } from "../pages/Dashboard/ShopOwner/ShopOneOrder";
import { Confirmation } from "../pages/Auth/Confirmation";
import StripeContainer from "../StripeContainer";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


export const BiobukBrowser = () => {
  const { user, isLogged, publicKey } = useContext(BiobukContext);
  const [showNavBar, setShowNavBar] = useState(true);
  const [hide, setHide] = useState(false);


  /**
   * Controla la visibilidad del navbar y el sidebar
   */
  const handleShowAside = () => {
    if (!showNavBar) {
      setShowNavBar(true);
      setHide(false);
    } else {
      setHide(true);
      setTimeout(() => {
        setShowNavBar(false);
      }, 400);
    }
  };

  
  return (
    <Container fluid className="mainContainer">
      <BrowserRouter>
        <Row>
          <Col>
            <BiobukNavbar
              handleShowAside={handleShowAside}
              setShowNavBar={setShowNavBar}
              showNavBar={showNavBar}
              setHide={setHide}
              hide={hide}
            ></BiobukNavbar>
          </Col>
        </Row>
        <Row id="mainprincipal">
          <BiobukSidebar
            handleShowAside={handleShowAside}
            setShowNavBar={setShowNavBar}
            showNavBar={showNavBar}
            setHide={setHide}
            hide={hide}
          ></BiobukSidebar>
          <Col id="columnaPrincipal">
            <Routes>
              {/* Rutas sin loguear */}
              {isLogged === false && (
                <>
                  <Route path="/" element={<Home />}></Route>
                  <Route path="/about" element={<About />}></Route>
                  <Route path="/register" element={<Register />}></Route>
                  <Route path="/login" element={<Login />}></Route>
                  <Route
                    path="/confirmation/:user_id"
                    element={<Confirmation />}
                  ></Route>
                </>
              )}
              {isLogged === true && (
                /* Rutas comunes logueados */
                <>
                  <Route path="/login" element={<Login />}></Route>
                  <Route path="/" element={<Home />}></Route>
                  <Route path="/products" element={<ProductsList />}></Route>
                  <Route
                    path="/oneProduct/:product_id"
                    element={<OneProduct />}
                  ></Route>
                  {/* Rutas para todos menos Owner */}
                  {user?.type !== 1 && (
                    <>
                      <Route
                        path="/farmerProfile/:farmer_id"
                        element={<FarmerProfile />}
                      ></Route>
                      <Route
                        path="/allGreenhouses/:farmer_id"
                        element={<AllGreenhouses />}
                      ></Route>
                      <Route
                        path="/oneGreenhouse/:greenhouse_id"
                        element={<OneGreenhouse />}
                      ></Route>
                    </>
                  )}
                  {/* Rutas para farmer */}
                  {user?.type === 0 && (
                    <>
                      <Route
                        path="/stripe"
                        element={
                          <Elements stripe={loadStripe(publicKey)}>
                            <StripeContainer />
                          </Elements>
                        }
                      ></Route>
                      <Route
                        path="/allOrders/:farmer_id"
                        element={<OrderList />}
                      ></Route>
                      <Route
                        path="/oneOrder/:order_id"
                        element={
                          <OneOrder
                            setHide={setHide}
                            setShowNavBar={setShowNavBar}
                          />
                        }
                      ></Route>
                      <Route
                        path="/editfarmer/:farmer_id"
                        element={<EditFarmerProfile />}
                      ></Route>
                      <Route
                        path="/createGreenhouse/:farmer_id"
                        element={<CreateGreenhouse />}
                      ></Route>
                      <Route
                        path="/editGreenhouse/:greenhouse_id"
                        element={<EditGreenhouse />}
                      ></Route>
                      <Route
                        path="/shopping_cart"
                        element={<ShoppingCart />}
                      ></Route>
                      <Route
                        path="/confirmPurchase/:order_id"
                        element={<ConfirmPurchase />}
                      ></Route>
                    </>
                  )}
                  {/* Rutas para Owner */}
                  {user?.type === 1 && (
                    <>
                      <Route
                        path="/shop/:shop_id"
                        element={<ShopProfile />}
                      ></Route>
                      <Route
                        path="/shop/orders/:owner_id"
                        element={<ShopOrders />}
                      ></Route>
                      <Route
                        path="/shop/orders/oneOrder/:order_id/:owner_id"
                        element={
                          <ShopOneOrder
                            setHide={setHide}
                            setShowNavBar={setShowNavBar}
                          />
                        }
                      ></Route>
                      <Route path="/myShops" element={<MyShops />}></Route>
                      <Route
                        path="/oneShop/:shop_id"
                        element={<ShopInfo />}
                      ></Route>
                      <Route
                        path="/editShopProfile/:owner_id"
                        element={<EditShopProfile />}
                      ></Route>
                    </>
                  )}
                  {/* Rutas para Admin */}
                  {user?.type === 2 && (
                    <>
                      <Route
                        path="/allFarmers"
                        element={<AllFarmers />}
                      ></Route>
                      <Route
                        path="/adminProfile/:admin_id"
                        element={<AdminProfile />}
                      ></Route>
                      <Route
                        path="/editGreenhouse/:greenhouse_id"
                        element={<EditGreenhouse />}
                      ></Route>
                      <Route
                        path="/admin/allGreenhouses"
                        element={<AdminAllGreenhouses />}
                      ></Route>
                    </>
                  )}
                </>
              )}
              <Route path="*" element={<Error />}></Route>
            </Routes>
          </Col>
        </Row>
        <Row>
          <Col>
            <BiobukFooter></BiobukFooter>
          </Col>
        </Row>
      </BrowserRouter>
    </Container>
  );
};
