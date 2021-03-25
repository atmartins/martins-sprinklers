import React from 'react';
import { milliseconds } from "./shared/time";
import './countdown.css';

export const Countdown = ({ initial, remaining, children, dir = 'down' }: { initial: milliseconds, remaining: milliseconds, children?: JSX.Element | string, dir?: 'down' | 'up' }) => {
    const style = dir === 'down' ? {top: `${100 - (remaining/initial)*100}%`} : {top: `${(remaining/initial)*100}%`}
    return  <div className="countdown">
        <div className="countdown-phaser" style={style}></div>
        <div className="countdown-children">{children}</div>
    </div>;
}