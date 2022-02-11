import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Introduction',
    Svg: require('../../static/img/intro.svg').default,
    description: (
      <>
        🖐Hi!, I’m Dennis. I’m a full-stack developer, I live in the Philippines 🇵🇭.
      </>
    ),
    display:'fontFace text--center padding-horiz--md',
  },
  {
    title: '"🅾🆁🅰🅶🅾🅽 "',
    Svg: require('../../static/img/logo.svg').default,
    description: (
      <>
      According to the Urban Dictionary, 🅾🆁🅰🅶🅾🅽 “is Bicol slang for somebody who is feisty, 
      determined, principled, a fighter, unafraid of consequences, and who stands up for his(/her) principles.
      ” Perhaps like the Tagalog astig (coined from tigas) which simply means tough. Orag is the oomph that makes a person 🅾🆁🅰🅶🅾🅽.
      </>
    ),
    display:'fontFace text--center padding-horiz--md',
  },
  {
    title: 'This site will serve:',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
      <h3></h3>
        <ul>
          <li>
            as my personal information.
          </li>
          <li>
          projects that I'm working with (see my <a target='_blank' href='https://github.com/DennisPitallano?tab=repositories'>GITHUB</a>)
          </li>
        </ul>
      </>
    ),
    display:'fontFace text--left padding-horiz--md',
  },
];

function Feature({Svg, title, description, display}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className={display}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
