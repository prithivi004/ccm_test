import Swal from 'sweetalert2'


export const Alert = (icon,title,msg) =>{

    Swal.fire({
        icon:icon,
        title:title,
        text:msg,
    })

}