import React from 'react';
import { getDate } from 'utils/config';

const Footer = () => {
  return (
    <footer className="border-t border-main">
      <div className="mx-auto container px-6 flex justify-center items-center py-8 md:py-12 ">
        <p className="text-sm md:text-base text-center leading-normal">
          &copy;{getDate()} - Designed & Build with obsessive attention to
          detail by
          <span className="text-primary-600 font-medium uppercase ms-2 align-middle">
            sajal das
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
