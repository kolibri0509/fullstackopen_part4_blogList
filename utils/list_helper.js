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
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}