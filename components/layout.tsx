import Link from "next/link";
import { useRouter } from "next/router";
import { jcn } from "../libs/client/utils";

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  hasTabBar?: boolean;
  children: React.ReactNode;
}

export default function Layout({
  title,
  canGoBack,
  hasTabBar,
  children,
}: LayoutProps) {
  const router = useRouter();
  const goBack = () => { router.back() };
  return (
    <div>
      <div className="bg-white w-full max-w-lg h-12 justify-center text-lg font-medium py-3 fixed text-gray-700 border-b top-0 flex items-center px-10" >
        {canGoBack ?
          <button onClick={goBack} className="absolute left-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button> : null}
        {title ? <span>{title}</span> : null}
      </div>
      <div className={jcn("pt-16", hasTabBar ? "pb-24" : "")}>
        {children}
      </div>
      <div >
        {hasTabBar ?
          <nav className="bg-white w-full max-w-lg text-gray-600 border-t fixed bottom-0 flex items-center justify-between py-2 px-10 text-xs">
            <Link href="/">
              <div className={jcn("flex flex-col items-center space-y-1 justify-center cursor-pointer",router.pathname === "/" ? "text-orange-500" : "hover:text-gray-500 transition-colors")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>홈</span>
              </div>
            </Link>
            <Link href="/community">
              <div className={jcn("flex flex-col items-center space-y-1 justify-center cursor-pointer",router.pathname === "/community" ? "text-orange-500" : "hover:text-gray-500 transition-colors")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <span>동네생활</span>
              </div>
            </Link>
            <Link href="/chats">
              <div className={jcn("flex flex-col items-center space-y-1 justify-center cursor-pointer",router.pathname === "/chats" ? "text-orange-500" : "hover:text-gray-500 transition-colors")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>대화</span>
              </div>
            </Link>
            <Link href="/streams">
              <div className={jcn("flex flex-col items-center space-y-1 justify-center cursor-pointer",router.pathname === "/streams" ? "text-orange-500" : "hover:text-gray-500 transition-colors")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>라이브</span>
              </div>
            </Link>
            <Link href="/profile">
              <div className={jcn("flex flex-col items-center space-y-1 justify-center cursor-pointer",router.pathname === "/profile" ? "text-orange-500" : "hover:text-gray-500 transition-colors")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>내당근</span>
              </div>
            </Link>
          </nav>
          : null
        }
      </div>
    </div>
  );
}