"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInvoiceUpdateRequest = exports.updateTaxInvoice = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const updateTaxInvoice_1 = require("../../schema/taxInvoice/updateTaxInvoice");
const updateTaxInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const TaxInvoiceUpdateData = updateTaxInvoice_1.TaxInvoicePartialUpdateSchema.parse(req.body);
        const { invoiceId, newInvoiceItems, updateInvoiceItems, deleteInvoiceItems } = TaxInvoiceUpdateData, updateData = __rest(TaxInvoiceUpdateData, ["invoiceId", "newInvoiceItems", "updateInvoiceItems", "deleteInvoiceItems"]);
        if (["TSMWA_EDITOR", "TQMA_EDITOR"].includes(req.user.role)) {
            yield __1.prismaClient.invoicePendingChanges.create({
                data: {
                    invoiceId,
                    updatedData: TaxInvoiceUpdateData,
                    modifiedBy: req.user.userId
                }
            });
            return res.status(200).json({ "message": "Update data successfully submitted" });
        }
        else if (["ADMIN"].includes(req.user.role)) {
            yield __1.prismaClient.invoicePendingChanges.create({
                data: {
                    invoiceId,
                    approvalStatus: "APPROVED",
                    note: "Approval granted automatically as the user is an admin.",
                    updatedData: TaxInvoiceUpdateData,
                    modifiedBy: req.user.userId
                }
            });
            if (deleteInvoiceItems && deleteInvoiceItems.length > 0) {
                const deleteItems = yield __1.prismaClient.invoiceItem.deleteMany({
                    where: {
                        id: {
                            in: deleteInvoiceItems.map(item => item.id),
                        },
                        taxInvoice: {
                            invoiceId: invoiceId,
                        },
                    },
                });
                console.log(deleteItems);
            }
            if (updateInvoiceItems && updateInvoiceItems.length > 0) {
                const updateItems = yield Promise.all(updateInvoiceItems.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    const { id } = item, updateItemData = __rest(item, ["id"]);
                    return yield __1.prismaClient.invoiceItem.update({
                        where: { id },
                        data: Object.assign({}, updateItemData),
                    });
                })));
            }
            if (newInvoiceItems && newInvoiceItems.length > 0) {
                const newItems = yield __1.prismaClient.invoiceItem.createMany({
                    data: newInvoiceItems.map(item => (Object.assign(Object.assign({}, item), { invoiceId: invoiceId }))),
                });
            }
            const updatedTaxInvoice = yield __1.prismaClient.taxInvoice.update({
                where: { invoiceId: invoiceId },
                data: Object.assign(Object.assign({}, updateData), { modifiedAt: new Date() }),
                include: {
                    invoiceItems: true, // Include updated invoice items
                },
            });
            return res.status(200).json({
                message: "Tax invoice updated successfully",
                data: updatedTaxInvoice,
            });
        }
        return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
    }
    catch (err) {
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.updateTaxInvoice = updateTaxInvoice;
const handleInvoiceUpdateRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, action, note } = req.body;
    const approvalStatus = action.toUpperCase();
    try {
        if (!["ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        if (!["APPROVED", "DECLINED"].includes(approvalStatus)) {
            return next(new bad_request_1.BadRequestsException("Invalid Action", root_1.ErrorCode.INVALID_INPUT));
        }
        const updateRequest = yield __1.prismaClient.invoicePendingChanges.findFirst({
            where: {
                id
            }
        });
        if (!updateRequest) {
            return next(new bad_request_1.BadRequestsException(`No request found with id ${id}`, root_1.ErrorCode.BAD_REQUEST));
        }
        yield __1.prismaClient.invoicePendingChanges.update({
            where: {
                id
            },
            data: {
                "approvalStatus": approvalStatus,
                "approvedOrDeclinedBy": req.user.userId,
                note
            }
        });
        yield updateHandler(updateRequest.updatedData);
        return res.status(200).json({
            message: "Tax invoice updated successfully",
            data: updateRequest.updatedData,
        });
    }
    catch (err) {
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.handleInvoiceUpdateRequest = handleInvoiceUpdateRequest;
const updateHandler = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { invoiceId, newInvoiceItems, updateInvoiceItems, deleteInvoiceItems } = data, updateData = __rest(data, ["invoiceId", "newInvoiceItems", "updateInvoiceItems", "deleteInvoiceItems"]);
    if (deleteInvoiceItems && deleteInvoiceItems.length > 0) {
        const deleteItems = yield __1.prismaClient.invoiceItem.deleteMany({
            where: {
                id: {
                    in: deleteInvoiceItems.map((item) => item.id),
                },
                taxInvoice: {
                    invoiceId: invoiceId,
                },
            },
        });
        console.log(deleteItems);
    }
    if (updateInvoiceItems && updateInvoiceItems.length > 0) {
        const updateItems = yield Promise.all(updateInvoiceItems.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = item, updateItemData = __rest(item, ["id"]);
            return yield __1.prismaClient.invoiceItem.update({
                where: { id },
                data: Object.assign({}, updateItemData),
            });
        })));
    }
    if (newInvoiceItems && newInvoiceItems.length > 0) {
        const newItems = yield __1.prismaClient.invoiceItem.createMany({
            data: newInvoiceItems.map((item) => (Object.assign(Object.assign({}, item), { invoiceId: invoiceId }))),
        });
    }
    const updatedTaxInvoice = yield __1.prismaClient.taxInvoice.update({
        where: { invoiceId: invoiceId },
        data: Object.assign(Object.assign({}, updateData), { modifiedAt: new Date() }),
        include: {
            invoiceItems: true, // Include updated invoice items
        },
    });
});
