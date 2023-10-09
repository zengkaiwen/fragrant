import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  span {
    opacity: 0;
    position: absolute;
    border-radius: 50%;
    background-color: red;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
  }
`

export interface FragrantProps {
  path: string;
  width: number;
  height: number;
  pathWidth: number;
  bgColor: string;
  fgColor: string;
  time: number; // 毫秒
  bgDuration?: number; // 毫秒
  start: boolean;
}

const Fragrant: React.FC<FragrantProps> = ({ path, width, height, pathWidth, bgColor, fgColor, time, bgDuration = 1_000, start = false }) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const bgRef = React.useRef<SVGPathElement>(null);
  const fgRef = React.useRef<SVGPathElement>(null);
  const dotRef = React.useRef<HTMLDivElement>(null);
  const endTimeRef = React.useRef<number>(0);
  const pathLenRef = React.useRef<number>(0);

  React.useEffect(() => {
    const _pathLen = bgRef.current?.getTotalLength();
    if (fgRef.current) {
      fgRef.current.style.strokeDasharray = `${_pathLen}`;
      fgRef.current.style.strokeDashoffset = `${_pathLen}`;
      fgRef.current.style.display = 'block';
    }
    if (bgRef.current) {
      bgRef.current.style.strokeDasharray = `${_pathLen}`;
      bgRef.current.style.strokeDashoffset = `${_pathLen}`;
      bgRef.current.style.display = 'block';
    }
    pathLenRef.current = _pathLen || 0;
    endTimeRef.current = Date.now() + time;
    setFire();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFire = React.useCallback(() => {
    if (!fgRef.current || !bgRef.current) return;
    const now = Date.now();
    if (now >= endTimeRef.current) {
      return;
    }
    const pathLength = pathLenRef.current;
    const fgValue = pathLength - pathLength * (endTimeRef.current - now) / time;
    const bgValue = pathLength - pathLength * (endTimeRef.current - now + bgDuration) / time;
    fgRef.current.style.strokeDashoffset = `${fgValue}`;
    bgRef.current.style.strokeDashoffset = `${bgValue}`;

    if (dotRef.current) {
      const points = fgRef.current.getPointAtLength(pathLength - fgValue);
      dotRef.current.style.left = `${points.x}px`;
      dotRef.current.style.top = `${points.y}px`;
    }
  }, [bgDuration, time]);

  const updateFire = React.useCallback(() => {
    if (!start) return;
    setFire();
    requestAnimationFrame(updateFire);
  }, [setFire, start]);

  React.useEffect(() => {
    if (start) {
      console.log('开始了')
      endTimeRef.current = Date.now() + time;
      dotRef.current && (dotRef.current.style.opacity = '1');
      requestAnimationFrame(updateFire)
    }
  }, [start, time, updateFire]);

  return (
    <Wrapper>
      <svg
        ref={svgRef}
        className="svgaProgress"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: width + "px",
          height: height + "px",
        }}
      >
        {/* 背景 */}
        <path
          ref={bgRef}
          style={{
            strokeWidth: pathWidth + "px",
            stroke: bgColor,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            fill: 'none'
          }}
          d={path}
        />
        {/* 香 */}
        <path
          ref={fgRef}
          d={path}
          style={{
            strokeWidth: pathWidth + "px",
            stroke: fgColor,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            fill: 'none',
          }}
        />
      </svg>
      <span ref={dotRef} style={{ width: `${pathWidth}px`, height: `${pathWidth}px` }} ></span>
    </Wrapper>
  );
};

export default Fragrant;
