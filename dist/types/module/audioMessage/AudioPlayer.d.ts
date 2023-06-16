export interface AudioPlayerProps {
}
export interface AudioPlayerProps {
    play?: boolean;
    reverse?: boolean;
    size?: string | number;
    prefix?: string;
    className?: string;
}
declare const AudioPlayer: (props: AudioPlayerProps) => import("react/jsx-runtime").JSX.Element;
export { AudioPlayer };
