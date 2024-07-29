import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the App component from deliberation-empirica
const EmpiricaApp = dynamic(
  () => import('../../../../deliberation-empirica/client/src/App.jsx'),
  { ssr: false } // Ensure server-side rendering is disabled
);

const DeliberationWrapper = () => {
  return (
    <div className="windii">
      <EmpiricaApp />
    </div>
  );
};

export default DeliberationWrapper;
