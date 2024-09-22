import { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { Settings } from "lucide-react";

import i18n from "../../localization/i18n";

export default function Setting() {
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const handleChangeLanguage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
    setSelectedLang(newLang);
  };

  return (
    <Dropdown
      radius="sm"
      classNames={{
        base: "before:bg-default-200",
        content: "p-0 border-small border-divider bg-background",
      }}
    >
      <DropdownTrigger>
        <Button variant="light" size="sm">
          <Settings size={20} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu className="max-h-[300px] overflow-y-auto">
        <DropdownSection aria-label="Preferences">
          <DropdownItem
            isReadOnly
            key="lang"
            className="cursor-default"
            endContent={
              <select
                className="z-10 outline-none w-24 py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
                id="lang"
                name="lang"
                value={selectedLang}
                onChange={handleChangeLanguage}
              >
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Español</option>
              </select>
            }
          >
            {t("Language_Select")}
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
