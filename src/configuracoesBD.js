import * as React from 'react';
export default function ConfiguracoesBD() {

    React.useEffect(() => {

        fetch('https://rmdevsolutions.com.br/barao/IP-API.php').then(async f => {
            const URL = await f.json();
            localStorage.setItem('API-URL', URL.IP);
            console.log(URL.IP)
        })



    }, [])

    return (
        <>

        </>
    )


}