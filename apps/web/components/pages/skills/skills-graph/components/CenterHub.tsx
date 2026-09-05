import { CX, CY } from '../constants';

export const CenterHub = ({ total }: { total: number }) => {
  return (
    <g>
      <circle
        cx={CX}
        cy={CY}
        r={40}
        fill="#0A0E12"
        stroke="#5EEAD4"
        strokeWidth={1.5}
        opacity={0.9}
      />
      <circle
        cx={CX}
        cy={CY}
        r={40}
        fill="none"
        stroke="#5EEAD4"
        strokeWidth={1}
        opacity={0.25}
      >
        <animate
          attributeName="r"
          values="40;54;40"
          dur="2.4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.3;0;0.3"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </circle>
      <text
        x={CX}
        y={CY - 3}
        textAnchor="middle"
        className="fill-white text-[13px] font-semibold tracking-wide"
      >
        SKILLS
      </text>
      <text
        x={CX}
        y={CY + 13}
        textAnchor="middle"
        className="fill-white/40 text-[9px]"
      >
        {total} total
      </text>
    </g>
  );
};
