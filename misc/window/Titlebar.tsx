import React, { CSSProperties } from 'react';
import { AiOutlineClose, AiOutlineMinus, AiOutlineExpandAlt } from "react-icons/ai";
import context from './titlebarContextApi';

const Titlebar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-7 text-sm">
      <div className="flex items-center justify-start py-1 px-5" style={{ WebkitAppRegion: 'drag' } as CSSProperties}>
        <button
          className="btn btn-circle btn-xs btn-error scale-75"
          onClick={context.exit}
          title="Close"
          style={{ WebkitAppRegion: 'no-drag' } as CSSProperties}
        >
          <AiOutlineClose />
        </button>
        <button
          className="btn btn-circle btn-xs btn-secondary scale-75"
          onClick={context.minimize}
          title="Minimize"
          style={{ WebkitAppRegion: 'no-drag' } as CSSProperties}
        >
          <AiOutlineMinus />
        </button>
        <button
          className="btn btn-circle btn-xs btn-primary scale-75"
          onClick={context.toggle_maximize}
          title="Maximize"
          style={{ WebkitAppRegion: 'no-drag' } as CSSProperties}
        >
          <AiOutlineExpandAlt />
        </button>
      </div>
    </div>
  );
};

export default Titlebar;
