import { BaseMessageProps } from '../baseMessage';
import { IconProps } from '../../component/icon';
import type { FileMessageType } from '../types/messageType';
export interface FileMessageProps extends BaseMessageProps {
    fileMessage: FileMessageType;
    iconType?: IconProps['type'];
    prefix?: string;
    className?: string;
    nickName?: string;
    type?: 'primary' | 'secondly';
}
declare const FileMessage: (props: FileMessageProps) => import("react/jsx-runtime").JSX.Element;
export { FileMessage };
