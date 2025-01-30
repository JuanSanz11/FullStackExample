import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { getGetUsersQueryKey, useCreateUser } from "./http/generated/users/users";

const createUserSchema = z.object({
    name: z.string().min(3, 'Nome precisa ter 3 caracteres')
})

type createUserSchema = z.infer<typeof createUserSchema>

export function CreateUser() {
    const queryClient = useQueryClient()

    const {handleSubmit, register, reset, formState: { errors } } = useForm<createUserSchema>({
    resolver: zodResolver(createUserSchema)

})

const { mutateAsync: createUser } = useCreateUser();

async function handleCreateUser(data: createUserSchema) {
    await createUser({ data: { name: data.name }})
    
    await queryClient.invalidateQueries({
        queryKey: getGetUsersQueryKey(),
    })
    reset()
}

    return (
        <div>
        <form onSubmit={handleSubmit(handleCreateUser)}>
            <input type="text" {...register('name')} />
            {errors.name && <span>{errors.name.message}</span>}
            <button type="submit">Criar usuário</button>
        </form>
        <button onClick={() => handleDeleteUser('user-id')}>Deletar usuário</button>
        </div>
    )
}
