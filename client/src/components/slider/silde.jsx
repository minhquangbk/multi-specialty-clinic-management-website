import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import { StartSlider } from '../../until/slideshow';

export default function Silde() {
 StartSlider();

  return (
    <Fragment>
       <section class="homepage-banner">
            <section>
                <div class="banner-slide"> 
                  <Link to={'/datlich'}>
                    <img  class="slide-img" src="../Images/Screenshot 2024-09-30 202652_upscayl_4x_ultrasharp.png" alt="slide" />
    
                    <img  class="slide-img" src="../Images/Screenshot 2024-09-30 210207_upscayl_4x_ultrasharp.png" alt="slide"/>

                    <img  class="slide-img" src="../Images/bannerphongkham7.jpg" alt="slide"/>
                  </Link>
                </div>
            </section>
        </section>
    </Fragment>
  )
}

