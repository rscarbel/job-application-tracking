-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "CompanyDetail_size_idx" ON "CompanyDetail"("size");

-- CreateIndex
CREATE INDEX "Compensation_payAmount_idx" ON "Compensation"("payAmount");

-- CreateIndex
CREATE INDEX "Job_workMode_idx" ON "Job"("workMode");

-- CreateIndex
CREATE INDEX "Job_title_idx" ON "Job"("title");

-- CreateIndex
CREATE INDEX "JobBenefit_jobId_idx" ON "JobBenefit"("jobId");
