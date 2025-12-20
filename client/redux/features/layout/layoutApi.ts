import { apiSlice } from "../api/apiSlice";


export const layoutApi = apiSlice.injectEndpoints({
    endpoints : (builder) =>({
        getHeroData : builder.query({
            query : (type)=>({
                url : `get-layout/${type}`,
                method :"GET",
                credentials : "include" as const,
            })
        }),
        updateLayout : builder.mutation({
            query : ({type, title, subTitle, bannerImage, faq, categories}) =>({
                url : "update-layout",
                method : "PUT",
                credentials : "include" as const,
                body : {type, title, subTitle, bannerImage, faq, categories}
            })
        }),
        editLayout : builder.mutation({
            query : ({type, title, subTitle, image, faq, categories}) =>({
                url : "edit-layout",
                method : "PUT",
                credentials : "include" as const,
                body : {type, title, subTitle, image, faq, categories}
            })
        })
    })
})

export const {useGetHeroDataQuery, useUpdateLayoutMutation, useEditLayoutMutation} = layoutApi