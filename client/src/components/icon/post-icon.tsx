export default function PostIcon({ color = "currentcolor" }: { color?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M17.5 1H2.5C1.67157 1 1 1.67157 1 2.5V17.5C1 18.3284 1.67157 19 2.5 19H17.5C18.3284 19 19 18.3284 19 17.5V2.5C19 1.67157 18.3284 1 17.5 1Z"
        fill={color}
        stroke="white"
        strokeLinejoin="round"
      />
      <path
        d="M10 6V14M6 10H14"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
