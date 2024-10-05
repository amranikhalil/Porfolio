import {useState} from 'react'
import styled, { keyframes } from 'styled-components'

const DEFAULT_COLOR = 'hsl(50deg, 100%, 50%)';

const random=(min,max)=>{
    return Math.floor(Math.random()*(max-min))+min
}
const range = (start, end, step = 1) => {
  let output = [];

  if (typeof end === 'undefined') {
    end = start;
    start = 0;
  }

  for (let i = start; i < end; i += step) {
    output.push(i);
  }

  return output;
};

const generateSparkle=(color= DEFAULT_COLOR)=>{
    return{
        id:String(random(1000,90000)),
        date: Date.now(),
        color,
        size:random(10,5),
        style:{
            top: random(0,100)+'%',
            left: random(0,100)+'%',
            zIndex:"2"
        }
    }
}
<svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z" fill="#FFC700"/>
</svg>

function SparkleInstance(color,style,size){
return(
    <Svg
        width='40px'
        height={size}
        viewBox="0 0 160 160"
        fill={color}
        style={style}
    >
        <path d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z" fill="#FFC700"/>
    </Svg>
)
}
function Sparkles({ children }) {
  const [sparkles, setSparkles] = React.useState([]);
  useRandomInterval(() => {
    const now = Date.now();
    // Create a new sparkle
    const sparkle = generateSparkle();
    // Clean up any "expired" sparkles
    const nextSparkles = sparkles.filter(sparkle => {
      const delta = now - sparkle.createdAt;
      return delta < 1000;
    });
    // Include our new sparkle
    nextSparkles.push(sparkle);
    // Make it so!
    setSparkles(nextSparkles);
  }, 50, 500);
  return (
    <Wrapper {...delegated}>
      {sparkles.map(sparkle => (
        <Sparkle
          key={sparkle.id}
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
        />
      ))}
      <ChildWrapper>{children}</ChildWrapper>
    </Wrapper>
  );
}

const Sparkle = ({ size, color, style }) => {
  const path =
    'M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z';
  return (
    <SparkleWrapper style={style}>
      <SparkleSvg width={size} height={size} viewBox="0 0 68 68" fill="none">
        <path d={path} fill={color} />
      </SparkleSvg>
    </SparkleWrapper>
  );
};

const SparkleWrapper = styled.span`
  position: absolute;
  display: block;`


const sparkleAnimation=keyframes`
0%{
   transform: scale(0) rotate(0deg)
}
50%{
   transform: scale(1) rotate(90deg)
}
100%{
   transform: scale(0) rotate(180deg)
}`
const spin = keyframes`
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(180deg);
}
`;

const SparkleSvg = styled.svg`
  display: block;
  @media (prefers-reduced-motion: no-preference) {
    animation: ${spin} 1000ms linear;
  }
`;
const ChildWrapper = styled.strong`
  position: relative;
  z-index: 1;
  font-weight: bold;
`;
const Wrapper=styled.span`
position: relative;
display:inline-block
`
const Svg= styled.svg`
    position:absolute;
    font-weight:bold;
    z-index:2;
    animation:${sparkleAnimation} 600ms forwards
`
