import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@murasoftware/next-core-assets/dist/mura.10.min.css";
import "@murasoftware/next-core-assets/dist/mura.10.skin.css";
import '../scss/custom.scss';
import '../../src/modules/scaffold/configurations/ScaffoldConfigurations';

import React from "react";
import ScaffoldConfigurations from "../../src/modules/scaffold/configurations/ScaffoldConfigurations";

export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    console.log(metric) // The metric object ({ id, name, startTime, value, label }) is logged to the console
  }
}

export default function MuraApp({ Component, pageProps }) {

  console.log("I AM ALIVE!!!!");
  const scaffoldEndpoints = new ScaffoldConfigurations(true);
  pageProps.scaffoldEndpoints = scaffoldEndpoints;
  console.log("pp",pageProps);
  return  (
    <Component {...pageProps} />
  )
}