

import React from 'react';
import Link from 'next/link';
import { getHref } from '@murasoftware/next-core';

export const CTAButton = ({buttontext,buttonid,buttoncolor,buttonlink,buttontarget,buttontype,routerless=false}) => {
    const Buttontype = buttontype ? buttontype : 'heap';
    let Buttontarget = buttontarget ? buttontarget : '_self';
    switch (Buttontarget){
        case "Self":
            Buttontarget = '_self'
            break
        case "Top":
            Buttontarget = '_top'
            break
        case "Blank":
            Buttontarget = '_blank'
            break
        case "Parent":
            Buttontarget = '_parent'
            break
    }
    switch(Buttontype){
        case "heap":
            if(!routerless) {
                return (
                    <Link href={buttonlink||'https://www.murasoftware.com'} passHref>
                        <a target={Buttontarget||'_self'} className={`style--${buttoncolor||'primary'}-button`} id={buttonid} role="button">
                            <span className="inner-button">
                                <InnerButton buttoncolor={buttoncolor} buttontext={buttontext} />
                            </span>
                        </a>
                    </Link>
                );
            }
            else {
                return (
                    <RouterlessLink href={buttonlink||'https://www.murasoftware.com'} passHref target={Buttontarget||'_self'} id={buttonid} className={`style--${buttoncolor||'primary'}-button`} role="button">
                        <span className="inner-button">
                            <InnerButton buttoncolor={buttoncolor} buttontext={buttontext} />
                        </span>
                    </RouterlessLink>                        
                )
            }
        case "bootstrap":
            return(
                <Link href={buttonlink||'https://www.murasoftware.com'} passHref>
                    <a target={Buttontarget||'_self'} className={`style--${buttoncolor||'primary'}-button`} role="button">
                        {buttontext}
                    </a>
                </Link>
            );        
    }  
}

const InnerButton = (props) => {
    switch(props.buttoncolor){
        case "secondary":
            return(
            <>
                <svg className="button-before" viewBox="0 0 13 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 57H3L13 1H9.94318L0 28.5V57Z" fill="#ED485F"></path>
                    <path d="M3 57H1V28.5L10.9432 1H13" stroke="#ED485F" strokeWidth="2"></path>
                    </svg>
                    <span className="button-text">
                        {props.buttontext || 'Press Me'}
                    </span>
                    <svg className="button-after" viewBox="0 0 13 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 1H10L0 57H3.05682L13 29.5V1Z" fill="#ED485F"></path>
                    <path d="M10 1H12V29.5L2.05682 57H0" stroke="#ED485F" strokeWidth="2"></path>
                </svg>
            </>
            );   
            break;     
        default:
            return(
            <>
                <svg className="button-before" viewBox="0 0 13 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 57H3L13 1H9.94318L0 28.5V57Z" fill="#ED485F"></path>
                    <path d="M3 57H1V28.5L10.9432 1H13" stroke="#ED485F" strokeWidth="2"></path>
                    </svg>
                    <span className="button-text">
                        {props.buttontext || 'Press Me'}
                    </span>
                    <svg className="button-after" viewBox="0 0 13 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 1H10L0 57H3.05682L13 29.5V1Z" fill="#ED485F"></path>
                    <path d="M10 1H12V29.5L2.05682 57H0" stroke="#ED485F" strokeWidth="2"></path>
                </svg>
            </>
            );        
    }
    
}

export const RouterlessLink = function({href,children,className,id}) {
    return (
      <a href={getHref(href)} className={className} id={id}>
        {children}
      </a>
    );
  }

export default CTAButton;