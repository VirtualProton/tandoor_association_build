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
exports.updateTaxInvoice = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const updateTaxInvoice_1 = require("../../schema/taxInvoice/updateTaxInvoice");
const updateTaxInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taxInvoiceData = updateTaxInvoice_1.updateTaxInvoiceSchema.parse(req.body);
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        // Exclude invoiceId from the update data
        const { invoiceId, newInvoiceItem, updateInvoiceItem, deleteInvoiceItem } = taxInvoiceData, updateData = __rest(taxInvoiceData, ["invoiceId", "newInvoiceItem", "updateInvoiceItem", "deleteInvoiceItem"]);
        yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            if (deleteInvoiceItem && deleteInvoiceItem.length > 0) {
                const deleteIds = deleteInvoiceItem.map((item) => item.id);
                yield prisma.invoiceItem.deleteMany({
                    where: {
                        id: {
                            in: deleteIds,
                        },
                        invoiceId: invoiceId,
                    },
                });
            }
            if (newInvoiceItem && newInvoiceItem.length > 0) {
                yield __1.prismaClient.invoiceItem.createMany({
                    data: newInvoiceItem.map((item) => (Object.assign(Object.assign({}, item), { invoiceId: invoiceId }))),
                });
            }
            if (updateInvoiceItem && updateInvoiceItem.length > 0) {
                for (const item of updateInvoiceItem) {
                    const { id } = item, itemData = __rest(item, ["id"]);
                    yield __1.prismaClient.invoiceItem.update({
                        where: { id, invoiceId },
                        data: itemData,
                    });
                }
            }
            // Ensure invoiceId is not updated
            yield __1.prismaClient.taxInvoice.update({
                where: { invoiceId },
                data: Object.assign(Object.assign({}, updateData), { modifiedBy: req.user.userId }),
            });
        }));
        return res.status(200).json({
            message: `Tax invoice ${invoiceId} updated successfully`,
        });
    }
    catch (err) {
        console.log(err);
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.updateTaxInvoice = updateTaxInvoice;
