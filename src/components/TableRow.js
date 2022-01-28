const TableRow = (property, value, valueStyle) => {
    return `
        <tr class="relative">
            <td class="border-b p-4 font-semibold">
                ${property}
            </td>
            <td class="border-b p-4 pl-10 ${valueStyle ?? ''}">
                ${value}
            </td>
        </tr>
    `;
};

export default TableRow;
