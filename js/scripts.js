$(document).ready(function(){
	data = new Object;
	data['numEntries'] = 0;
	data['entries'] = [];
	avg = 0;
	sumCreditsCompleted = 0;
	sumCredits_x_Grades = 0;
	Modernizr.localstorage ? LS_available = true : LS_available = false;
	if(LS_available) {
		loadData();
	}
});

function loadPage() {
	// checks if local storage is available and if it has previous saved info
}

function addGrade() {
	var errorOcurred = false;
	var className = $('#inputClassName').val();
	if(className.length == 0) {
		$('#inputClassName + span').html('O nome da cadeira é obrigatório.');
		$('#inputClassName').parents('.control-group').addClass('error');
		errorOcurred = true;
	} else {
		$('#inputClassName + span').html('');
		$('#inputClassName').parents('.control-group').removeClass('error');
	}

	var classGrade = $('#inputGrade').val();
	if(classGrade.length == 0 || classGrade > 20) {
		$('#inputGrade').parents('.control-group').addClass('error');
		errorOcurred = true;
		classGrade > 20 ? $('#inputGrade + span').html('Classificação inválida.') : $('#inputGrade + span').html('A classificação da cadeira é obrigatória.');
	} else {
		$('#inputGrade + span').html('');
		$('#inputGrade').parents('.control-group').removeClass('error');
	}

	var classECTS = $('#inputECTS').val();
	if(classECTS.length == 0 || classECTS > 30) {
		$('#inputECTS').parents('.control-group').addClass('error');
		errorOcurred = true;
		classECTS > 30 ? $('#inputECTS + span').html('Créditos inválidos.') : $('#inputECTS + span').html('O número de ECTS da cadeira é obrigatório.');
	} else {
		$('#inputECTS + span').html('');
		$('#inputECTS').parents('.control-group').removeClass('error');
	}

	if(!errorOcurred) {
		var grade;
		if(classGrade < 10) {
			grade = $('<span class="label label-important">'+classGrade+'</span>');
		} else {
			grade = $('<span class="label label-success">'+classGrade+'</span>');
		}
		if($('table').length == 0) {
			$('.container').append('<table class="table table-hover table-condensed"></table>');
			$('table').append('<tr><th>#</th><th>Cadeira</th><th>Classificação</th><th>Créditos/ECTS</th><th></th></tr>')
			$('table').append('<tr><td>'+$('tr').length+'</td><td>'+className+'</td><td></td><td>'+classECTS+'</td><td><a href="#" onClick="return removeEntry(this)" class="btn btn-mini btn-danger"><i class="icon-trash icon-white"></i></a></td></tr>');
			$('tr:last > td:nth-child(3)').append(grade);
		} else {
			$('table').append('<tr><td>'+$('tr').length+'</td><td>'+className+'</td><td></td><td>'+classECTS+'</td><td><a href="#" onClick="return removeEntry(this)" class="btn btn-mini btn-danger"><i class="icon-trash icon-white"></i></a></td></tr>');
			$('tr:last > td:nth-child(3)').append(grade);
		}
		$('#inputClassName').val('');
		$('#inputGrade').val('');
		$('#inputECTS').val('');
		data['numEntries']++;
		data['entries'].push({Nome:className, Classificação:classGrade, Créditos:classECTS});
		updateFinalGrade(parseInt(classGrade), parseInt(classECTS));
		if( LS_available && $('#saveData').length == 0) {
			//$('.hero-unit').append('<button class="btn btn-small btn-primary" type="button"><i class="icon-circle-arrow-up icon-white"></i> Exportar dados</button>');
			$('.hero-unit').append('<button type="button" id="saveData" class="btn btn-small btn-primary" data-toggle="modal" data-target="#saveDataModal"><i class="icon-hdd icon-white"></i> Guardar dados</button>');
		}
	}
}

function updateFinalGrade(classGrade, classECTS) {
	if(classGrade >= 10) {
		sumCreditsCompleted +=  classECTS;
		sumCredits_x_Grades += (classGrade * classECTS);
		avg = sumCredits_x_Grades / sumCreditsCompleted;
		if(avg - Math.floor(avg) >= 0.5) {
			$('#grade').html(Math.ceil(avg));
		} else {
			$('#grade').html(Math.floor(avg));
		}
	}
	//$('table').before('<code>'+JSON.stringify(data)+'</code>'); //will be used for export data
}

function saveData() {
	localStorage['hasDataSaved'] = true;
	localStorage['numEntries'] = data['numEntries'];
	for(var i = 0; i < data['numEntries']; i++) {
		localStorage[i] = JSON.stringify(data['entries'][i]);
		//console.log(JSON.parse(localStorage[i]));
	}
	$('#saveDataModal').modal('hide');
}

function loadData() {
	if(localStorage['hasDataSaved'] == "true") {
		//alert("tem dados guardados");
		console.log("tem dados guardados");
		console.log(localStorage['numEntries']);
	}
}

function removeEntry(element) {
	var row = $(element).parents('tr');
	console.log(row.find('td').html()); // the index 
	$(element).parents('tr').remove();
}