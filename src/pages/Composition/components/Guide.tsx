import React, { useState, useEffect } from 'react'
import Joyride, { STATUS, ACTIONS } from 'react-joyride';
import Cookies from 'js-cookie'
import step1image from 'pages/Composition/files/step1.gif'
import step2image from 'pages/Composition/files/step2.gif'
import step3image from 'pages/Composition/files/step3.gif'
import step4image from 'pages/Composition/files/step4.gif'

const Guide = () => {

  const [run, setRun] = useState(false)

  useEffect(() => {
    const consent = Cookies.get('cookieConsent')
    const hasSeenTour = Cookies.get('hasSeenTour')
    if (consent === 'accepted' && !hasSeenTour) {
      setTimeout(() => {
        setRun(true);
      }, 1500); // Wait for 2 seconds before starting the tour
    }
  }, []);

  const steps = [
    {
      target: '.image-plot',
      content: (
        <div className="text-center mt-2">
          <img
            src={step1image}
            alt="Scrolling in and out of the cryosection"
            className="w-30"
          />
          <p className="mt-2">Hover, Scroll in and out of the image</p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '.image-plot',
      content: (
        <div className="text-center mt-2">
          <img
            src={step2image}
            alt="Clicking on a single sample and then dragging to select multiple samples"
            className="w-30"
          />
          <p className="mt-2">Click one sample or drag to select multiple samples to see their genome composition</p>
        </div>
      ),
      disableBeacon: true,
    },

    {
      target: '.image-plot',
      content: (
        <div className="text-center mt-2">
          <img
            src={step3image}
            alt="Double clicking to deselect all samples"
            className="w-30"
          />
          <p className="mt-2">Double click inside the image box to deselect all samples</p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '.taxonomic-level-buttons',
      content: (
        <div className="text-center mt-2">
          <img
            src={step4image}
            alt="Selecting taxonomic level"
            className="w-30"
          />
          <p className="mt-2">Select the taxonomic level to see the taxonomy of the selected samples</p>
        </div>
      ),
      disableBeacon: true,
    },
  ]

  const handleJoyrideCallback = (data: any) => {
    const { status, action } = data;
    if (
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED ||
      action === ACTIONS.CLOSE
    ) {
      Cookies.set('hasSeenTour', 'true', { expires: 365 });
      setRun(false); // Stop the tour when finished
    }
  };

  const styles = {
    options: {
      primaryColor: '#9D2560', // button bg color, light_burgundy
      textColor: '#555', // text color
    },
  }

  return (
    <>
      {run && (
        <Joyride
          steps={steps}
          run={run}
          continuous={true}
          disableScrolling={true}
          scrollToFirstStep={true}
          showProgress={true}
          showSkipButton={true}
          callback={handleJoyrideCallback}
          locale={{ last: 'End', skip: 'Skip guide' }}
          styles={styles}
        />
      )}
    </>
  )
}

export default Guide