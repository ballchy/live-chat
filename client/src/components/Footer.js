import React from 'react';
import styled from 'styled-components'

const SitckyBottom = styled.div`
    position: fixed;
    padding: 5px 10px;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #3f51b5;
    color: white;
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    line-height: 1.75;
    letter-spacing: 0.02857em;
    text-transform: uppercase;
`

const Footer = () => {
    return (
        <SitckyBottom>Footer</SitckyBottom>
    );
}

export default Footer;