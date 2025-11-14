export const Button = ({ variant = "default", size = "default", children, className = "", ...props }) => {
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  }

  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3 text-sm",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  const baseStyles =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

  const buttonClass = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`
//   const login = async () => {
//     const domain = "dev-fcepv4jphzal67g7.us.auth0.com";
//     const audience = "https://n-device-api/";
//     const scope = "read:details";
//     const clientId = "sWhhGDOzdBaINnywlcjS2iL8Ur7GhUt1";
//     const responseType = "code";
//     const redirectUri = "http://localhost:3000/user";

//     const response = await fetch(
//       `https://${domain}/authorize?` + 
//       `audience=${audience}&` + 
//       `scope=${scope}&` +
//       `response_type=${responseType}&` +
//       `client_id=${clientId}&` +
//       `redirect_uri=${redirectUri}`, {
//         redirect: "manual"
//       }
//     );
//     console.log(response);
//     window.location.replace(response.url);
//   };

const login = () => {
  const domain = "dev-fcepv4jphzal67g7.us.auth0.com";
  const audience = "https://n-device-api/";
  const scope = "openid profile email read:details";
  const clientId = "sWhhGDOzdBaINnywlcjS2iL8Ur7GhUt1";
  const responseType = "code";
  const redirectUri = "http://localhost:3000/user";

  const authUrl = `https://${domain}/authorize?` +
    `audience=${encodeURIComponent(audience)}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `response_type=${responseType}&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}`;

  // 👇 Redirect browser to Auth0
  window.location.href = authUrl;
};


return (
    <button onClick={() => login()} className={buttonClass} {...props}>
      {children}
    </button>
  )
}
