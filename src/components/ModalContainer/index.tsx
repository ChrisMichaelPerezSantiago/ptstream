import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalProps,
} from "@nextui-org/react";
import { Fragment } from "react/jsx-runtime";

type Props = ModalProps & {
  title?: string;
  bodyContent: JSX.Element;
};

export const ModalContainer = ({ title, bodyContent, ...props }: Props) => {
  return (
    <Modal {...props}>
      <ModalContent>
        {(onClose) => (
          <Fragment>
            {title ? (
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            ) : null}
            <ModalBody>{bodyContent}</ModalBody>
          </Fragment>
        )}
      </ModalContent>
    </Modal>
  );
};
