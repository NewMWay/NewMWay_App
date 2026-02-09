const formatSold = (sold: number) => {
        if (sold >= 1000) {
            return (sold / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
        }
        return sold?.toString()
    }

export default formatSold;