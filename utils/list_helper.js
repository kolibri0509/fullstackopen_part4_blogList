const dummy = (blogs) => 1

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    let max = 0
    blogs.forEach(blog => {
        if(max < blog.likes){
            max = blog.likes
        }
        return max
    })
    return blogs.length > 0
        ? blogs.find(el => el.likes === max)
        : 'there is no blog'
}
const mostBlogs = (blogs) => {
    let newObj = {}
    if(blogs.length>0){
        const res = blogs.reduce((acc, i) => {
            if(acc.hasOwnProperty(i.author)){
                acc[i.author]+=1
            }else{
                acc[i.author]=1
            }
            return acc
        },{})
        let max = Math.max.apply(Math,Object.values(res))
        let findArr = Object.entries(res).find(arr => {
            if(arr.includes(max)){
                return arr
            }
        })
        newObj = {
            author: findArr[0],
            blogs: findArr[1]
        }
    }else{
        newObj = {
            author: 'become the first author',
            blogs:0
        }
    }
    return newObj
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}