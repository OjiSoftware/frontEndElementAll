import { useEffect, useState } from "react";

export const useItemsPerpage = () => {
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const updateItems = () => {
        const actualWidth = window.innerWidth;

        if (actualWidth < 640) {
            setItemsPerPage(3);
        } else if (actualWidth < 1024) {
            setItemsPerPage(5);
        } else {
            setItemsPerPage(6);
        }

    }

    useEffect(() => {
        updateItems();

        window.addEventListener('resize', updateItems)

        return () => window.removeEventListener('resize', updateItems)

    }, [])



    return itemsPerPage;
}


