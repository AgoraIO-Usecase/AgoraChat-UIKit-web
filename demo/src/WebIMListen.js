import {setval} from './comm'
const initListen = () => {
    WebIM.conn.listen({
        onOpened: () => {
            console.log('登录成功')
            setval('success')
        },
    })
}

export default initListen