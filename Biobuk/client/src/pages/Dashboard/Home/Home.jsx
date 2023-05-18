import React from 'react'
import "./Home.scss"
import { Row, Col } from "react-bootstrap";


export const Home = () => {
  return (
    <Row className='home'>
      <Col xs= {12} className="logo-home">
        <img src="/Biobuk_logo.png" alt="Logo de Biobuk" />
      </Col>
      <Col xs= {12} className="example background">
        <p><span>Biobuk</span> es una tienda de productos fitosanitarios, abonos y nutrientes.</p>
        <p>Podrás encontrar todos los productos que necesites al mejor precio</p>
      </Col>
    </Row>
  )
}
