'use client';
import dynamic from 'next/dynamic';
import config from '../../keystatic.config';

const Keystatic = dynamic(() => import('@keystatic/next/ui/app').then(({ makePage }) => makePage(config)), { ssr: false });
export default Keystatic;
