package com.inn.cafe.utils;

import com.inn.cafe.POJO.Order;
import com.inn.cafe.POJO.Offer;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.*;

import java.io.ByteArrayOutputStream;

public class BillPdfGenerator {

    public static byte[] generateStyledBill(Order order, Offer offer) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
        DeviceRgb headerColor = new DeviceRgb(63, 81, 181); // Indigo

        // Logo (optional)
        try {
            String logoPath = "C:/Users/Admin/Documents/Cafe Management system/frontend/src/assets/images/klassy-logo.png";
            Image logo = new Image(ImageDataFactory.create(logoPath))
                    .setHeight(80)
                    .setHorizontalAlignment(HorizontalAlignment.CENTER);
            document.add(logo);
        } catch (Exception e) {
            // Ignore if logo is missing
        }

        // Title
        Paragraph title = new Paragraph("Cafe Receipt")
                .setFont(font)
                .setFontSize(18)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(title);

        // Customer Info Table
        Table infoTable = new Table(UnitValue.createPercentArray(new float[]{2, 4}))
                .useAllAvailableWidth();

        infoTable.addCell(new Cell().add(new Paragraph("Customer:")).setBold());
        infoTable.addCell(new Cell().add(new Paragraph(order.getCustomerName())));
        infoTable.addCell(new Cell().add(new Paragraph("Contact:")).setBold());
        infoTable.addCell(new Cell().add(new Paragraph(order.getContactNumber())));
        infoTable.addCell(new Cell().add(new Paragraph("Email:")).setBold());
        infoTable.addCell(new Cell().add(new Paragraph(order.getEmail())));
        infoTable.addCell(new Cell().add(new Paragraph("Order Date:")).setBold());
        infoTable.addCell(new Cell().add(new Paragraph(order.getOrderDate().toString())));
        infoTable.setMarginBottom(20);
        document.add(infoTable);

        // Billing Summary Table
        Table billTable = new Table(UnitValue.createPercentArray(new float[]{4, 2}))
                .useAllAvailableWidth();

        billTable.addHeaderCell(new Cell().add(new Paragraph("Description"))
                .setBackgroundColor(headerColor).setFontColor(DeviceRgb.WHITE).setBold());
        billTable.addHeaderCell(new Cell().add(new Paragraph("Amount"))
                .setBackgroundColor(headerColor).setFontColor(DeviceRgb.WHITE).setBold());

        int totalAmount = order.getTotalAmount();
        int tax = order.getTax();
        int serviceCharge = order.getServiceCharge();
        int grossAmount = totalAmount + tax + serviceCharge;

        billTable.addCell(new Cell().add(new Paragraph("Total Amount")));
        billTable.addCell(new Cell().add(new Paragraph("₹ " + totalAmount)));

        billTable.addCell(new Cell().add(new Paragraph("Tax")));
        billTable.addCell(new Cell().add(new Paragraph("₹ " + tax)));

        billTable.addCell(new Cell().add(new Paragraph("Service Charge")));
        billTable.addCell(new Cell().add(new Paragraph("₹ " + serviceCharge)));

        int discountPercent = (offer != null) ? offer.getDiscountPercent() : 0;
        int discountAmount = (discountPercent * grossAmount) / 100;

        if (discountPercent > 0) {
            billTable.addCell(new Cell().add(new Paragraph("Discount (" + discountPercent + "%)")));
            billTable.addCell(new Cell().add(new Paragraph("- ₹ " + discountAmount)));
        }

        int finalAmount = grossAmount - discountAmount;

        billTable.addCell(new Cell(1, 1).add(new Paragraph("Final Total")).setBold());
        billTable.addCell(new Cell(1, 1).add(new Paragraph("₹ " + finalAmount)).setBold());

        billTable.setMarginBottom(30);
        document.add(billTable);

        // Payment Info
        Table paymentTable = new Table(UnitValue.createPercentArray(new float[]{2, 4}))
                .useAllAvailableWidth();

        paymentTable.addCell(new Cell().add(new Paragraph("Payment Method:")).setBold());
        paymentTable.addCell(new Cell().add(new Paragraph(order.getPaymentMode())));

        paymentTable.addCell(new Cell().add(new Paragraph("Payment Status:")).setBold());
        paymentTable.addCell(new Cell().add(new Paragraph(order.getPaymentStatus())));

        paymentTable.addCell(new Cell().add(new Paragraph("Transaction ID:")).setBold());
        paymentTable.addCell(new Cell().add(new Paragraph(
                order.getTransactionId() != null ? order.getTransactionId() : "N/A")));

        document.add(paymentTable);

        // Signature line
        Paragraph signature = new Paragraph("Signature: __________________________")
                .setTextAlignment(TextAlignment.RIGHT)
                .setMarginTop(20);
        document.add(signature);

        document.close();
        return out.toByteArray();
    }
}
