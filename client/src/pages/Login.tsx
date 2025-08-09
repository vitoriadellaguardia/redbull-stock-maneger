export const LoginPage = () => {

    return (
        <section className="w-full border h-[45rem] flex items-center justify-center">
            <div className="border p-9 w-96 h-80 flex justify-center items-center flex-col rounded ">
                <h1 className="text-3xl font-bold">Login</h1>
                <form className="flex flex-col gap-4 mt-4">
                    <input type="text" placeholder="Email" className="border p-2 rounded" />
                    <input type="password" placeholder="Senha" className="border p-2 rounded" />
                    <button className="bg-blue-500 text-white p-2 rounded">Entrar</button>
                </form>
            </div>
        </section>
    )
}