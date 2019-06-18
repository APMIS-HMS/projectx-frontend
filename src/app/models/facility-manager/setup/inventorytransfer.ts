import { InventoryTransferTransaction } from './inventorytransfertransaction';
export interface InventoryTransfer {
    _id: string;
    facilityId: string;
    storeId: string;
    destinationStoreId: string;
    transferBy: string;
    inventorytransactionTypeId: any;
    inventoryTransferTransactions: InventoryTransferTransaction[];
    totalCostPrice: number;
    createdAt: Date;
    updatedAt: Date;
    isOpen: boolean;
}
