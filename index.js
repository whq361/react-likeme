
import React, { useEffect, useState ,useCallback} from "react";
import { View, Button, Canvas, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";

var secToMs = (ms) => (ms || 0) * 1000;
export function useAnimate(props) {
    const { start, end, complete, onComplete, delay = 0, duration = DEFAULT_DURATION, easeType = 'linear',ALL="all" } = props;
    const transition = React.useMemo(() => `${ALL} ${duration}s ${easeType} ${delay}s`, [duration, easeType, delay]);
    const [style, setStyle] = React.useState(Object.assign(Object.assign({}, start), { transition }));
    const [isPlaying, setIsPlaying] = React.useState(false);
    const onCompleteTimeRef = React.useRef();
    const onCompleteCallbackRef = React.useRef(onComplete);
    const playRef = React.useRef();
    React.useEffect(() => {
        onCompleteCallbackRef.current = onComplete;
    }, [onComplete]);
    React.useEffect(() => () => {
        onCompleteTimeRef.current && clearTimeout(onCompleteTimeRef.current);
    }, []);
    if (!playRef.current) {
        playRef.current = (isPlay) => {
            setStyle(Object.assign(Object.assign({}, (isPlay ? end : start)), { transition }));
            setIsPlaying(true);
            onCompleteTimeRef.current = setTimeout(() => {
                if (isPlay && (complete || onComplete)) {
                    complete && setStyle(complete);
                    onCompleteCallbackRef.current && onCompleteCallbackRef.current();
                }
                setIsPlaying(false);
            }, secToMs(delay + duration));
        };
    }
    console.log(playRef)
    return {
        isPlaying,
        style,
        play: playRef.current,
    };
}
export function LikeAnim(props) {
    const { top, left } = props;
    const { style, play } = useAnimate({
        start: { opacity: 0},
        end: { opacity: 1},
        duration:0.6,
        complete: { display: 'none' },
        onComplete: () => {
            //动画结束的方法
            console.log("complete");
        },
    });
    useEffect(() => play(true), []);
    return (
        <View
            className="likeme-container"
            style={{ top: `${top}px`, left: `${left}px`, ...style }}
        >
            <Image
                className="hand-img"
                src="xxxx/images/dzgif-1.gif"
                // onLoad={loadImg()}
            />
        </View>
    );
}

function test() {
    const [list, setList] = useState([]);
    const touchEnd = (e) => {
        console.log(e);
        let x = e.detail.x;
        let y = e.detail.y;
        console.log(x);
        console.log(y);
        setList([
            ...list,
            {
                x: x - 41,
                y: y - 41,
                key:+new Date()
            },
        ]);
    };

    return (
        <View className="test" onClick={touchEnd}>
       
            <View
                className="button"
                onClick={() => {
                         Taro.showToast({
                        title: '点按钮了',
                        icon: 'none'
                      })
                }}
            >
                按钮，测试遮挡
            </View>

            {list.map((item, index) => {
                return <LikeAnim left={item.x} top={item.y} />;
            })}
        </View>
    );
}



export default test;
