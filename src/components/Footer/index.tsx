import { useEffect, useState } from "react";
import { GithubIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <footer
      className={`
        bg-white py-2 px-4 fixed bottom-0 left-0 right-0 shadow-md
        transition-all duration-1000 ease-in-out
        ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        }
        z-50 // Ensure the footer is above other content
      `}
    >
      <div className="container flex items-center justify-between mx-auto">
        <p className="text-sm text-gray-700">
          &copy; {currentYear} {t("Copyright")}
        </p>
        <a
          href={"https://github.com/ChrisMichaelPerezSantiago/ptstream"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 transition-colors hover:text-gray-900 group"
        >
          <GithubIcon
            size={24}
            className="transition-transform duration-300 ease-in-out transform group-hover:rotate-12 group-hover:scale-110"
          />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
