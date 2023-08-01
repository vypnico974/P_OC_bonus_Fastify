export const loginAction = (req,res) => {
    return res.view('templates/login.ejs')
}

export const logoutAction = (req,res) => {
    return 'logout'
}